import { useRecoilState } from 'recoil';
import { useDataMutation } from "@dhis2/app-runtime";
import { useShowAlerts } from 'dhis2-semis-functions';
import { TableDataRefetch } from 'dhis2-semis-types';

const POST_EVENT: any = {
    resource: 'tracker',
    type: 'create',
    data: ({ data }: any) => data,
    params: {
        importStrategy: 'CREATE_AND_UPDATE',
        async: false
    }
}

export function useUpdateTei() {
    const { hide, show } = useShowAlerts()
    const [refetch, setRefetch] = useRecoilState<boolean>(TableDataRefetch)

    const [create, { loading, data, error }] = useDataMutation(POST_EVENT, {
        onComplete: () => {
            show({ message: "Transfer updated successfully", type: { success: true } })
            setRefetch(!refetch)
        },
        onError: (error) => {
            show({
                message: `Could not save the transfer details: ${error.message}`,
                type: { critical: true }
            });
            setTimeout(hide, 5000);
        }
    });

    return {
        loadUpdateTei: loading,
        updateTei: create,
        data
    }
}
