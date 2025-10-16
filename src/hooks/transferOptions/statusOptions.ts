import { DataStoreProps } from "dhis2-semis-types"
import { StatusOptionsProps } from "../../types/transfer/statusOptions"

export const useTransferConst = ({ dataStore }: { dataStore: DataStoreProps[0] }) => {

    function transferConst({ status }: StatusOptionsProps) {
        const data = (dataStore?.transfer?.statusOptions as unknown as any)?.find((option: any) => option.configKey === status)?.configKey

        return data
    }

    return {
        transferConst
    }
}
