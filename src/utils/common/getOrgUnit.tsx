import React from 'react'
import { useGetOusData } from '../../hooks/orgUnits/useGetOrgUnits';
import { DataStoreProps } from 'dhis2-semis-types';
import { useUrlParams } from 'dhis2-semis-functions';
import { useGetComponent } from './getComponent';
import { getFormattedTimeDifference } from './getDiff';
import { useTransferConst } from '../../hooks/transferOptions/statusOptions';
import { TabPosistion } from '../../types/tabs/TabsTypes';

function OuNameContainer({ dataStoreData, setData, setModalDetails }: { setModalDetails: any, setData: (args: any) => any, dataStoreData: DataStoreProps[0] }) {
    const { getOuName } = useGetOusData()
    const [loaading, setLoading] = React.useState(true)
    const { urlParameters } = useUrlParams()
    const { position } = urlParameters
    const { getComponent } = useGetComponent({ setModalDetails, dataStore: dataStoreData })
    const { transferConst } = useTransferConst({ dataStore: dataStoreData })

    async function getOuDisplayName(tableData: any[]) {
        setLoading(true);

        const idHolder: Record<string, string> = {};
        const destinySchool = dataStoreData.transfer.destinySchool;
        const originSchool = dataStoreData.transfer.originSchool;

        // Collect all unique OU IDs to fetch at once
        const allOuIds = new Set<string>();

        for (const data of tableData) {
            if (data[destinySchool]) allOuIds.add(data[destinySchool]);
            if (data['registrationEventOrgUnit']) allOuIds.add(data['registrationEventOrgUnit']);
        }

        // Fetch OU names only for unknown IDs
        const ouIdsToFetch = Array.from(allOuIds).filter((id) => !idHolder[id]);

        if (ouIdsToFetch.length > 0) {
            const responses = await Promise.all(ouIdsToFetch.map((id) => getOuName(id).catch(() => null)));

            responses.forEach((res: any, i) => {
                const id = ouIdsToFetch[i];
                const name = res?.results?.name ?? id;
                idHolder[id] = name;
            });


            for (const data of tableData) {
                data[destinySchool] = idHolder[data[destinySchool]] || data[destinySchool];
                // The request origin is the org unit where the transfer request event was created.
                // The "Origin School" data element of the request cannot be used: it is optional and
                // requests created in the mobile app leave it empty.
                data[originSchool] = idHolder[data['registrationEventOrgUnit']] || data['registrationEventOrgUnit'];

                const configKey = (dataStoreData?.transfer?.statusOptions as unknown as any)?.find((x: any) => x.code == data[dataStoreData.transfer.status])

                if (configKey?.configKey === transferConst({ status: "penddingCode" })) {
                    // Measure the elapsed time from the moment the request was created (createdAt),
                    // not from the request date (occurredAt), which has no time of day.
                    data['requestTime'] = getFormattedTimeDifference(data.registrationEventCreatedAt);
                } else {
                    data['requestTime'] = '--';
                }

                data[dataStoreData.transfer.status] = getComponent(
                    configKey,
                    data,
                    position === TabPosistion.INCOMING,
                    data?.status == 'CANCELLED'
                );
            }
        }

        setData(tableData);
        setLoading(false);
    }

    return { getOuDisplayName, loaading }
}
export default OuNameContainer
