import useGetSelectedKeys from "../config/useGetSelectedKeys";

const useGetUsedProgramStages = () => {
    const { dataStoreData } = useGetSelectedKeys()
    const { performance, "final-result": finalResult, "socio-economics": socioEconomics, registration, transfer } = dataStoreData;
    const performanceProgramStages = performance?.programStages?.map((programStage: any) => programStage?.programStage) ?? [];

    return performance ? [...performanceProgramStages, finalResult?.programStage, socioEconomics?.programStage, registration?.programStage, transfer?.programStage] : []
}
export default useGetUsedProgramStages