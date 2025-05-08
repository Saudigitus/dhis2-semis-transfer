import { useDataEngine } from "@dhis2/app-runtime";
import { EventQueryProps } from "dhis2-semis-types/dist/declarations/types/api/WithoutRegistrationTypes";

const EVENT_QUERY = (queryProps: EventQueryProps) => ({
    results: {
        resource: "tracker/events",
        params: {
            ...queryProps
        }
    }
})

export function useGetEvent() {
    const engine = useDataEngine();

    async function getEvent(program: string, programStage: string, filter: string[], trackedEntity: string, fields: string, orgUnit?: string ) {
            return await engine.query(EVENT_QUERY({
                pageSize:10,
                program: program,
                programStage: programStage,
                filter: filter,
                orgUnit: orgUnit as unknown as string,
                trackedEntity: trackedEntity,
                order: "occurredAt:desc",
                fields,
            }));
    }

    return { getEvent }
}
