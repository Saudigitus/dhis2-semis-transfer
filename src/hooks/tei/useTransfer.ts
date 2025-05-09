import { useState } from 'react'
import { useRecoilState } from 'recoil'
import { useDataEngine } from '@dhis2/app-runtime'
import { useGetEventsByEnrollment } from '../events/useGetEventsByEnrollment'
import { TableDataRefetch } from 'dhis2-semis-types'
import { useTransferConst } from '../transferOptions/statusOptions'
import { useGetSectionTypeLabel, useUploadEvents } from 'dhis2-semis-functions'
import { useDataStoreKey, useProgramsKeys } from 'dhis2-semis-components'
import { formatEnrollmentBody } from '../../utils/tei/enrollmentBody'
import useGetUsedProgramStages from '../programStages/useGetUsedPProgramStages'

const TRANSFERQUERY: any = {
    resource: 'tracker/ownership/transfer',
    type: 'update',
    params: ({ program, ou, trackedEntityInstance }: any) => ({
        program,
        ou,
        trackedEntityInstance
    })
}

export function useTransferTEI({ selectedTei, handleCloseApproval }: { selectedTei: any, handleCloseApproval: () => void }) {
    const engine = useDataEngine()
    const { sectionName } = useGetSectionTypeLabel()
    const dataStoreData = useDataStoreKey({ sectionType: sectionName });
    const [loading, setloading] = useState(false)
    const [refetch, setRefetch] = useRecoilState<boolean>(TableDataRefetch)
    const { transferConst } = useTransferConst({ dataStore: dataStoreData })
    const { uploadValues } = useUploadEvents()
    const { getEventsByEnrollment, loading: loadingEvents } = useGetEventsByEnrollment()
    const programStagesToTransfer = useGetUsedProgramStages()
    const programsValues = useProgramsKeys();

    const transferTEI = async (ou: any) => {
        setloading(true)
        const events = await getEventsByEnrollment(selectedTei?.enrollmentId, selectedTei?.trackedEntity, programStagesToTransfer)
        const registrationEvent: any = events?.find((x: any) => x?.programStage == dataStoreData.registration.programStage) ?? {}
        const index: any = events?.findIndex((x: any) => x?.programStage == dataStoreData.transfer.programStage)
        const transferEvent: any = events?.splice(index, 1)[0]

        await engine.mutate(TRANSFERQUERY, {
            variables: {
                program: selectedTei?.programId,
                ou,
                trackedEntityInstance: selectedTei?.trackedEntity
            }
        })
            .then(async () => {
                const trackedEntities = formatEnrollmentBody(programsValues[0], events!, registrationEvent, ou, transferEvent, { ...selectedTei, trackedEntityType: dataStoreData.trackedEntityType }, transferConst({ status: "approved" }), dataStoreData?.transfer?.status)
                await uploadValues({ trackedEntities: trackedEntities }, 'COMMIT', 'CREATE_AND_UPDATE').then((resp) => {
                    setloading(false)
                    handleCloseApproval(); setRefetch(!refetch)
                })
            }).catch(e => {
                setloading(false)
            }).finally(() =>
                setloading(false)
            )
    }

    const rejectTEI = async () => {
        setloading(true)
        const events = await getEventsByEnrollment(selectedTei?.enrollmentId, selectedTei?.trackedEntity, [dataStoreData.transfer.programStage])
        const updatedEvent = [{
            ...events?.[0],
            dataValues: [...events?.[0]?.dataValues?.filter((x: any) => x?.dataElement != dataStoreData?.transfer?.status),
            {
                dataElement: dataStoreData?.transfer?.status,
                value: transferConst({ status: "reproved" })
            }]
        }]

        await uploadValues({ events: updatedEvent }, 'COMMIT', 'CREATE_AND_UPDATE').then((resp) => {
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
