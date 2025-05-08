import { DataStoreProps } from "dhis2-semis-types"
import { StatusOptionsProps } from "src/types/transfer/statusOptions"

export const useTransferConst = ({ dataStore }: { dataStore: DataStoreProps[0] }) => {

    function transferConst({ status }: StatusOptionsProps) {
        return dataStore?.transfer?.statusOptions?.find((option: any) => option.key === status)?.code
    }

    return {
        transferConst
    }
}
