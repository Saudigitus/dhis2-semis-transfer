import { useGetSectionTypeLabel } from "dhis2-semis-functions";
import { useDataStoreKey } from "dhis2-semis-components";

const useGetUsedProgramStages = () => {
    const { sectionName } = useGetSectionTypeLabel()
    const dataStoreData = useDataStoreKey({ sectionType: sectionName });
    const { performance, "final-result": finalResult, "socio-economics": socioEconomics, registration } = dataStoreData;
    const performanceProgramStages = performance?.programStages.map((programStage: any) => programStage.programStage) ?? [];

    return performance ? [...performanceProgramStages, finalResult?.programStage, socioEconomics?.programStage, registration?.programStage] : []
}
export default useGetUsedProgramStages
