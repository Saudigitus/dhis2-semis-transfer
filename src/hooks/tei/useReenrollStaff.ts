import { format } from "date-fns"
import { useDataStoreKey, useProgramsKeys } from "dhis2-semis-components"
import { useGetEvents, useGetSectionTypeLabel, useShowAlerts, useUploadEvents, useUrlParams } from "dhis2-semis-functions"
import { TableDataRefetch } from "dhis2-semis-types"
import { useState } from "react"
import { useRecoilState, useSetRecoilState } from "recoil"
import { ReenrollSummaryState } from "../../schemas/summarySchema"

const useReenrollStaff = () => {
    const { sectionName } = useGetSectionTypeLabel();
    const { getEvents } = useGetEvents()
    const dataStoreData = useDataStoreKey({ sectionType: sectionName });
    const [loadingReenroll, setLoadingReenroll] = useState<boolean>(false)
    const programsValues = useProgramsKeys();
    const { urlParameters } = useUrlParams();
    const { school: orgUnit } = urlParameters();
    const { uploadValues } = useUploadEvents()
    const setRefetch = useSetRecoilState(TableDataRefetch);
    const programData = programsValues[1];
    const { show } = useShowAlerts()
    const [openSummary, SetOpenSummary] = useRecoilState(ReenrollSummaryState);


    const reenrollStaff = async ({ staffs, clearSelectedStaffs, formValues, closeModal }:
        { staffs: any[], formValues: any, clearSelectedStaffs: () => void, closeModal: () => void }) => {
        setLoadingReenroll(true)

        let registrationDataValues: any = []
        const socioProgramStage = dataStoreData["socio-economics"].programStage
        const registrationProgramStage = dataStoreData.registration.programStage
        let enrollments: any = []
        const academicYearDataElement = dataStoreData?.registration?.academicYear
        const selectedAcademicYear = formValues[dataStoreData?.registration?.academicYear]
        let enrollmentDate = formValues?.enrollment_date
        let occurredAt = format(new Date(), 'yyyy-MM-dd')

        Object.keys(dataStoreData.registration).forEach((ds: any) => {
            if (formValues?.[(dataStoreData?.registration as unknown as any)?.[ds]]) {
                registrationDataValues.push({
                    dataElement: (dataStoreData?.registration as unknown as any)?.[ds],
                    value: formValues?.[(dataStoreData?.registration as unknown as any)?.[ds]]
                })
            }
        })

        const getEventStructure = (stage: string, datavalues: any[]) => {
            return { occurredAt, notes: [], status: "ACTIVE", program: programData.id, programStage: stage, orgUnit, scheduledAt: occurredAt, dataValues: datavalues }
        }

        const staffsUnableToSave: any[] = []
        const staffsAbleToSave: any[] = []

        for (const staff of staffs) {
            let events = []
            let socioEconomicDataValues: any = []

            const regEvents = await getEvents({
                program: staff?.programId, fields: "*", trackedEntity: staff?.trackedEntity, programStage: registrationProgramStage,
                filter: [`${academicYearDataElement}:in:${selectedAcademicYear}`],
            })

            if (regEvents?.length > 0) {
                staffsUnableToSave.push(staff)
            } else {
                staffsAbleToSave.push(staff)

                if (socioProgramStage) {
                    const socioEvent = await getEvents({ program: staff.programId, fields: "*", trackedEntity: staff.trackedEntity, programStage: socioProgramStage })
                    const event = socioEvent?.find((x: any) => x.enrollment === staff.enrollmentId)

                    if (event) {
                        event?.dataValues.forEach((dataValue: any) => {
                            socioEconomicDataValues.push({
                                dataElement: dataValue?.dataElement,
                                value: dataValue?.value
                            })
                        })
                        events.push(getEventStructure(socioProgramStage, socioEconomicDataValues))
                    }
                }

                events.push(getEventStructure(dataStoreData.registration.programStage, registrationDataValues))

                enrollments.push(
                    {
                        enrollments: [
                            {
                                occurredAt,
                                enrolledAt: enrollmentDate,
                                program: programData.id,
                                orgUnit,
                                status: "COMPLETED",
                                events: events
                            }
                        ],
                        orgUnit,
                        trackedEntityType: dataStoreData.trackedEntityType,
                        trackedEntity: staff.trackedEntity
                    })
            }
        }

        await uploadValues({ trackedEntities: enrollments }, 'COMMIT', 'CREATE_AND_UPDATE').then((resp) => {
            clearSelectedStaffs()
            show({
                message: "Promotion completed successfully",
                type: { success: true }
            })
            setRefetch(prevValue => (!prevValue))
        })

        setLoadingReenroll(false)
        closeModal()
        SetOpenSummary({
            created: staffsAbleToSave.length,
            conflicts: staffsUnableToSave.length,
            conflictDetails: staffsUnableToSave
        })
    }
    return { reenrollStaff, loadingReenroll }

}
export { useReenrollStaff }