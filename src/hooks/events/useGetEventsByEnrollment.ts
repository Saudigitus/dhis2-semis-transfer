import { useState, useCallback } from "react";
import { useGetEvent } from "./useGetEvent";
import { useGetSectionTypeLabel } from "dhis2-semis-functions";
import { useDataStoreKey } from "dhis2-semis-components";

interface Event {
    event: string;
    enrollment: string;
    trackedEntity: string;
    [key: string]: any;
}

export function useGetEventsByEnrollment() {
    const { getEvent } = useGetEvent();
    const { sectionName } = useGetSectionTypeLabel();
    const dataStoreData = useDataStoreKey({ sectionType: sectionName });

    const [loading, setLoading] = useState(false);
    const [eventsForTransfer, setEventsForTransfer] = useState<Event[]>([]);

    const getEventsByEnrollment = useCallback(async (
        enrollment: string,
        trackedEntity: string,
        programStagesToTransfer: string[]
    ) => {
        if (!dataStoreData?.program) return;

        setLoading(true);

        try {
            const eventPromises = programStagesToTransfer.map(stage =>
                getEvent(dataStoreData.program, stage, [], trackedEntity, "*")
                    .then((response: any) => {
                        const event = response?.results?.instances?.find(
                            (instance: any) => instance.enrollment === enrollment
                        );
                        return event || null;
                    })
                    .catch(() => null)
            );

            const events = (await Promise.all(eventPromises)).filter(Boolean);
            setEventsForTransfer(events);
        } catch (error) {
            console.error("Erro ao buscar eventos:", error);
            setEventsForTransfer([]);
        } finally {
            setLoading(false);
        }
    }, [getEvent, dataStoreData?.program]);

    return {
        events: eventsForTransfer,
        getEventsByEnrollment,
        loading
    };
}
