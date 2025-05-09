import { useState } from "react";
import { useGetEvents, useGetSectionTypeLabel } from "dhis2-semis-functions";
import { useDataStoreKey } from "dhis2-semis-components";

export function useGetEventsByEnrollment() {
    const { getEvents } = useGetEvents()
    const { sectionName } = useGetSectionTypeLabel();
    const dataStoreData = useDataStoreKey({ sectionType: sectionName });
    const [loading, setLoading] = useState(false);

    const getEventsByEnrollment = async (
        enrollment: string,
        trackedEntity: string,
        programStagesToTransfer: string[]
    ) => {
        if (!dataStoreData?.program) return;

        setLoading(true);

        try {
            const eventPromises = programStagesToTransfer.map(stage =>
                getEvents({ program: dataStoreData?.program, programStage: stage, trackedEntity, fields: "*" })
                    .then((response: any) => {
                        console.log(stage, response, 'response')
                        const event = response?.results?.instances?.find(
                            (instance: any) => instance.enrollment === enrollment
                        );
                        return event || null;
                    })
                    .catch(() => null)
            );

            const events = await Promise.all(eventPromises)
            return events
        } catch (error) {

        } finally {
            setLoading(false);
        }
    }

    return {
        getEventsByEnrollment,
        loading
    };
}
