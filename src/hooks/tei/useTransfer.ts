import { useState } from 'react'
import { useRecoilState } from 'recoil'
import { useConfig, useDataEngine } from '@dhis2/app-runtime'
import { useGetEventsByEnrollment } from '../events/useGetEventsByEnrollment'
import { TableDataRefetch } from 'dhis2-semis-types'
import { useTransferConst } from '../transferOptions/statusOptions'
import { useShowAlerts, useUploadEvents } from 'dhis2-semis-functions'
import { formatEnrollmentBody } from '../../utils/tei/enrollmentBody'
import useGetUsedProgramStages from '../programStages/useGetUsedPProgramStages'
import useGetSelectedKeys from '../config/useGetSelectedKeys'

// The parameter names follow the DHIS2 version: `trackedEntity` from 2.41 (2.42 refuses
// `trackedEntityInstance`) and `orgUnit` from 2.43 (2.43 refuses `ou`), both with 400.
const TRANSFERQUERY: any = {
    resource: 'tracker/ownership/transfer',
    type: 'update',
    params: ({ program, ou, trackedEntity, apiVersion }: any) => ({
        program,
        ...(apiVersion >= 43 ? { orgUnit: ou } : { ou }),
        ...(apiVersion >= 41 ? { trackedEntity } : { trackedEntityInstance: trackedEntity })
    })
}

export function useTransferTEI({ selectedTei, handleCloseApproval }: { selectedTei: any, handleCloseApproval: () => void }) {
    const engine = useDataEngine()
    const { apiVersion } = useConfig()
    const { show, hide } = useShowAlerts()
    const { dataStoreData, program: programData } = useGetSelectedKeys()
    const [loading, setloading] = useState(false)
    const [refetch, setRefetch] = useRecoilState<boolean>(TableDataRefetch)
    const { uploadValues } = useUploadEvents()
    const { getEventsByEnrollment, loading: loadingEvents } = useGetEventsByEnrollment()
    const programStagesToTransfer = useGetUsedProgramStages()

    // The transfer table is built from the transfer program stage, so the clicked row's
    // `registrationEvent` holds the uid of the transfer request that must be changed.
    const clickedTransferEventId = selectedTei?.registrationEvent

    const getTransferValue = (event: any, dataElement?: string) =>
        event?.dataValues?.find((dataValue: any) => dataValue?.dataElement === dataElement)?.value

    const getClickedTransferEvent = (events: any[]) =>
        events?.find((event: any) =>
            event?.programStage == dataStoreData?.transfer?.programStage && event?.event === clickedTransferEventId
        )

    const canApplyTransferDecision = (transferEvent: any, targetSchool: any) => {
        const pendingCode = dataStoreData?.transfer?.statusOptions?.find((x: any) => x.configKey === "penddingCode")?.code

        if (!transferEvent) return false
        if (getTransferValue(transferEvent, dataStoreData?.transfer?.status) !== pendingCode) return false
        if (targetSchool && getTransferValue(transferEvent, dataStoreData?.transfer?.destinySchool) !== targetSchool) return false
        return true
    }

    const notifyAndClose = (message: string) => {
        show({ message, type: { critical: true } })
        setTimeout(hide, 5000);
        setloading(false)
        handleCloseApproval()
    }

    const transferTEI = async (ou: any) => {
        setloading(true)
        const events = await getEventsByEnrollment(selectedTei?.enrollmentId, selectedTei?.trackedEntity, programStagesToTransfer)
        const registrationEvent: any = events?.find((x: any) => x?.programStage == dataStoreData.registration.programStage) ?? {}
        const transferEvent: any = getClickedTransferEvent(events)
        const restEvents = events?.filter((x: any) => x?.programStage != dataStoreData?.transfer?.programStage) || []

        if (Object.keys(registrationEvent).length === 0) {
            notifyAndClose(`Registration event is missing in this enrollment.`)
        }

        else if (!canApplyTransferDecision(transferEvent, ou)) {
            notifyAndClose(`This transfer request is no longer pending or does not belong to the selected school.`)
        }

        else {
            await engine.mutate(TRANSFERQUERY, {
                variables: {
                    program: selectedTei?.programId,
                    ou,
                    trackedEntity: selectedTei?.trackedEntity,
                    apiVersion
                }
            })
                .then(async () => {
                    const transferStatus = dataStoreData.transfer?.statusOptions?.find((x: any) => x.configKey === "approvedCode")?.code

                    const trackedEntities = formatEnrollmentBody(programData,
                        restEvents!,
                        registrationEvent,
                        ou,
                        transferEvent,
                        { ...selectedTei, trackedEntityType: dataStoreData.trackedEntityType },
                        transferStatus,
                        dataStoreData?.transfer?.status
                    )

                    await uploadValues({ trackedEntities: trackedEntities }, 'COMMIT', 'CREATE_AND_UPDATE').then((response: any) => {
                        if (response?.stats?.ignored > 0) {
                            show({ message: `Transfer failed: ${response?.validationReport?.errorReports?.[0]?.message}.`, type: { critical: true } })
                        } else if (response?.stats?.ignored == 0) {
                            show({ message: `Transfer successful.`, type: { success: true } })
                        }

                        setTimeout(hide, 5000);
                        setloading(false)
                        handleCloseApproval(); setRefetch(!refetch)
                    })
                })
                .catch((e: any) => {
                    // Show why the ownership change was refused instead of leaving the dialog loading.
                    notifyAndClose(`Transfer failed: ${e?.details?.message ?? e?.message ?? ''}`)
                }).finally(() =>
                    setloading(false)
                )
        }
    }

    const rejectTEI = async (targetSchool: any) => {
        setloading(true)
        const events = await getEventsByEnrollment(selectedTei?.enrollmentId, selectedTei?.trackedEntity, [dataStoreData.transfer.programStage])
        const transferEvent: any = getClickedTransferEvent(events)

        if (!canApplyTransferDecision(transferEvent, targetSchool)) {
            notifyAndClose(`This transfer request is no longer pending or does not belong to the selected school.`)
            return
        }

        const transferStatus = dataStoreData?.transfer?.statusOptions?.find((x: any) => x.configKey === "reprovedCode")?.code

        const updatedEvent = [{
            ...transferEvent,
            dataValues: [...transferEvent?.dataValues?.filter((x: any) => x?.dataElement != dataStoreData?.transfer?.status),
            {
                dataElement: dataStoreData?.transfer?.status,
                value: transferStatus
            }]
        }]

        await uploadValues({ events: updatedEvent }, 'COMMIT', 'CREATE_AND_UPDATE').then(() => {
            setloading(false)
            handleCloseApproval(); setRefetch(!refetch)
        })

        setloading(false)
    }

    return {
        loading: loading,
        loadingEvents,
        transferTEI,
        rejectTEI
    }
}
