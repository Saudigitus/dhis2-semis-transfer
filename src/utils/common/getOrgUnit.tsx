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
            if (data['orgUnitId']) allOuIds.add(data['orgUnitId']);
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
        }

        for (const data of tableData) {
            data[destinySchool] = idHolder[data[destinySchool]] || data[destinySchool];
            data[originSchool] = idHolder[data['orgUnitId']] || data['orgUnitId'];

            if (data[dataStoreData.transfer.status] === transferConst({ status: "pending" })) {
                data['requestTime'] = getFormattedTimeDifference(data.registrationEventOccurredAt);
            } else {
                data['requestTime'] = '--';
            }

            data[dataStoreData.transfer.status] = getComponent(
                data[dataStoreData.transfer.status],
                data,
                position === TabPosistion.INCOMING,
                false
            );
        }

        setData(tableData);
        setLoading(false);
    }

    return { getOuDisplayName, loaading }
}
export default OuNameContainer
