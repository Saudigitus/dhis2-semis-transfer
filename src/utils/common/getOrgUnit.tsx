import React from 'react'
import { useTimeZoneConversion } from '@dhis2/app-runtime';
import { useGetOusData } from '../../hooks/orgUnits/useGetOrgUnits';
import { D2I18n, DataStoreProps } from 'dhis2-semis-types';
import { useUrlParams } from 'dhis2-semis-functions';
import { useGetComponent } from './getComponent';
import { getFormattedTimeDifference } from './getDiff';
import { useTransferConst } from '../../hooks/transferOptions/statusOptions';
import { TabPosistion } from '../../types/tabs/TabsTypes';

// Key of the origin school name in each row: the org unit of the request event.
export const ORIGIN_SCHOOL_KEY = 'originSchool'

function OuNameContainer({ dataStoreData, setData, setModalDetails, i18n }: { setModalDetails: any, setData: (args: any) => any, dataStoreData: DataStoreProps[0], i18n: D2I18n }) {
    const { getOuName } = useGetOusData()
    const [loaading, setLoading] = React.useState(true)
    const { urlParameters } = useUrlParams()
    const { position } = urlParameters
    const { getComponent } = useGetComponent({ setModalDetails, dataStore: dataStoreData })
    const { transferConst } = useTransferConst({ dataStore: dataStoreData })
    const { fromServerDate } = useTimeZoneConversion()

    async function getOuDisplayName(tableData: any[]) {
        setLoading(true);

        const idHolder: Record<string, string> = {};
        const destinySchool = dataStoreData.transfer.destinySchool;

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
                // The origin school is always the org unit where the transfer request event was created.
                data[ORIGIN_SCHOOL_KEY] = idHolder[data['registrationEventOrgUnit']] || data['registrationEventOrgUnit'];

                const configKey = (dataStoreData?.transfer?.statusOptions as unknown as any)?.find((x: any) => x.code == data[dataStoreData.transfer.status])

                if (configKey?.configKey === transferConst({ status: "penddingCode" })) {
                    // Measure the elapsed time from the moment the request was created (createdAt),
                    // not from the request date (occurredAt), which has no time of day.
                    // createdAt is in the server time zone, so convert it to the browser time first.
                    data['requestTime'] = getFormattedTimeDifference(fromServerDate(data.registrationEventCreatedAt).toISOString(), i18n);
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
