import { useState, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { useDataEngine } from '@dhis2/app-runtime'
import { useEditDataElement } from '../events/useEditDataElement'
import { useUpdateTei } from '../events/useUpdateTeis'
import { useGetEventsByEnrollment } from '../events/useGetEventsByEnrollment'
import useGetUsedProgramStages from '../programStages/useGetUsedPProgramStages'
import { TableDataRefetch } from 'dhis2-semis-types'
import { useTransferConst } from '../transferOptions/statusOptions'
import { useGetSectionTypeLabel } from 'dhis2-semis-functions'
import { useDataStoreKey, useProgramsKeys } from 'dhis2-semis-components'
import { formatEnrollmentBody } from '../../utils/tei/enrollmentBody'

const TRANSFERQUERY: any = {
    resource: 'tracker/ownership/transfer',
    type: 'update',
    params: ({ program, ou, trackedEntityInstance }: any) => ({
        program,
        ou,
        trackedEntityInstance
    })
}

export function useTransferTEI({ handleCloseApproval }: { handleCloseApproval: () => void }) {
    const engine = useDataEngine()
    const { sectionName } = useGetSectionTypeLabel()
    const dataStoreData = useDataStoreKey({ sectionType: sectionName });
    const [loading, setloading] = useState(false)
    const { mutateValues } = useEditDataElement()
    const [refetch, setRefetch] = useRecoilState<boolean>(TableDataRefetch)
    const { transferConst } = useTransferConst({ dataStore: dataStoreData })
    const { loadUpdateTei, updateTei } = useUpdateTei();
    const selectedTei: any = {}
    const { events, getEventsByEnrollment, loading: loadingEvents } = useGetEventsByEnrollment()
    const programStagesToTransfer = useGetUsedProgramStages()
    const registrationEvent: any = events?.find((x: any) => x?.programStage == dataStoreData.registration.programStage) ?? {}
    const programsValues = useProgramsKeys();

    useEffect(() => {
        getEventsByEnrollment(selectedTei?.enrollmentId, selectedTei?.trackedEntity, programStagesToTransfer)
    }, []);

    console.log(events, 'jhdjkjhd')
    const transferTEI = async (ou: any, selectedTei: any) => {
        setloading(true)
        await engine.mutate(TRANSFERQUERY, {
            variables: {
                program: selectedTei?.programId,
                ou,
                trackedEntityInstance: selectedTei?.trackedEntity
            }
        })
            .then(async (res) => {
                const trackedEntities = formatEnrollmentBody(programsValues[0], events, registrationEvent, ou, selectedTei, selectedTei?.teiInstance, transferConst({ status: "approved" }), dataStoreData?.transfer?.status)
                await updateTei({ data: { trackedEntities } }).then(() => { handleCloseApproval(); setRefetch(!refetch) })
            }).catch(e => {
            })
        setloading(false)
    }

    const rejectTEI = async (event: any) => {
        setloading(true)
        await mutateValues(event, dataStoreData?.transfer?.status, transferConst({ status: "reproved" }) as string)
            .then(async (res) => {
                setRefetch(!refetch)
                handleCloseApproval()
            }).catch(e => {
                setloading(false)
            })
        setloading(false)
    }

    return {
        loading: loading || loadUpdateTei,
        loadingEvents,
        transferTEI,
        rejectTEI
    }
}
