import { useState } from "react";
import { useGetEvents } from "dhis2-semis-functions";
import useGetSelectedKeys from "../config/useGetSelectedKeys";

export function useGetEventsByEnrollment() {
    const { getEvents } = useGetEvents()
    const [loading, setLoading] = useState(false);
    const { dataStoreData } = useGetSelectedKeys();

    const getEventsByEnrollment = async (enrollment: string, trackedEntity: string, programStagesToTransfer: string[]) => {
        if (!dataStoreData?.program) return [];

        try {
            setLoading(true);

            const stages = programStagesToTransfer?.filter(Boolean) ?? [];

            const responses = await Promise.all(
                stages.map(stage =>
                    getEvents({ program: dataStoreData?.program, programStage: stage, trackedEntities: trackedEntity, fields: "*" })
                        .catch(() => null)
                )
            );

            return responses
                .flatMap((response: any) => response ?? [])
                .filter((instance: any) => instance?.enrollment === enrollment);
        } catch (error) {
            return [];
        } finally {
            setLoading(false);
        }
    };

    return { getEventsByEnrollment, loading };
}