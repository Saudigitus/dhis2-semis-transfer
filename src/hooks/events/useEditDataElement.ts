import { useDataMutation } from "@dhis2/app-runtime"
import { useGetSectionTypeLabel, useShowAlerts } from "dhis2-semis-functions"
import { useTransferConst } from "../transferOptions/statusOptions"
import { useDataStoreKey } from "dhis2-semis-components"

const UPDATE_DATAELEMENT_QUERY: any = {
    resource: 'events',
    type: 'update',
    id: ({ id }: any) => id,
    data: ({ form }: any) => form
}

export const useEditDataElement = () => {
    const { hide, show } = useShowAlerts()
    const { sectionName } = useGetSectionTypeLabel()
    const dataStoreData = useDataStoreKey({ sectionType: sectionName });
    const { transferConst } = useTransferConst({ dataStore: dataStoreData })

    const [mutate] = useDataMutation(UPDATE_DATAELEMENT_QUERY, {
        onComplete: () => {
            // show({ message: `${sectionName} transfer ${clickedButton === "approve" ? transferConst({status:"approved"}) as string : transferConst({status:"reproved"}) as string} successfuly`, type: { success: true } })
        },
        onError: (error) => {
            show({
                message: `Something went wrong: ${error.message}`,
                type: { critical: true }
            });
            setTimeout(hide, 5000);
        }
    })

    async function mutateValues(event: any, dataElement: string, value: string) {
        const data = {
            event: event?.event,
            orgUnit: event?.orgUnit,
            program: event?.program,
            programStage: event?.programStage,
            status: event?.status,
            trackedEntityInstance: event?.trackedEntityInstance,
            dataValues: [
                {
                    dataElement,
                    value
                }
            ]
        }

        await mutate({ id: `${event?.event}/${dataElement}`, form: data })
    }

    return {
        mutateValues
    }
}
