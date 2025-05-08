import { useDataEngine, useDataQuery } from "@dhis2/app-runtime";

const ORGUNIT_QUERY: any = {
    results: {
        resource: "organisationUnits",
        id: ({ id }: any) => id,
        params: {
            fields: [
                "id,name"
            ],
            paging: false
        }
    }
}

export function useGetOusData() {
    const engine = useDataEngine();

    async function getOuName(id: string) {
        return await engine.query(ORGUNIT_QUERY, { variables: { id: id } });
    }

    return {
        getOuName
    }
}
