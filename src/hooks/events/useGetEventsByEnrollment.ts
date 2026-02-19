import { useState } from "react";
import { useGetEvents } from "dhis2-semis-functions";
import useGetSelectedKeys from "../config/useGetSelectedKeys";

export function useGetEventsByEnrollment() {
    const { getEvents } = useGetEvents()
    const [loading, setLoading] = useState(false);
    const { dataStoreData } = useGetSelectedKeys();

    const getEventsByEnrollment = async (enrollment: string, trackedEntity: string, programStagesToTransfer: string[]) => {
        if (!dataStoreData?.program) return;

        try {
            setLoading(true);

            const eventPromises = programStagesToTransfer?.map(stage =>
                getEvents({ program: dataStoreData?.program, programStage: stage, trackedEntities: trackedEntity, fields: "*" })
                    .then((response: any) => {
                        const event = response?.filter(
                            (instance: any) => instance.enrollment === enrollment
                        );
                        return event[0] || null;
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

    return { getEventsByEnrollment, loading };
}