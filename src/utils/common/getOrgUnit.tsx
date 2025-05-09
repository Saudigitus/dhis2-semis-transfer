import React from 'react'
import { useGetOusData } from '../../hooks/orgUnits/useGetOrgUnits';
import { DataStoreProps } from 'dhis2-semis-types';
import { useUrlParams } from 'dhis2-semis-functions';
import { useGetComponent } from './getComponent';
import { getFormattedTimeDifference } from './getDiff';
import { useTransferConst } from '../../hooks/transferOptions/statusOptions';

function OuNameContainer({ dataStoreData, setData, setModalDetails }: { setModalDetails: any, setData: (args: any) => any, dataStoreData: DataStoreProps[0] }) {
    const { getOuName } = useGetOusData()
    const [loaading, setLoading] = React.useState(false)
    const { urlParameters } = useUrlParams()
    const { position } = urlParameters()
    const { getComponent } = useGetComponent({ setModalDetails, dataStore: dataStoreData })
    const { transferConst } = useTransferConst({ dataStore: dataStoreData })

    async function getOuDisplayName(tableData: any[]) {
        let idHolder: any = {}
        setLoading(true)
        const destinySchool = dataStoreData.transfer.destinySchool

        for (let data of tableData) {

            if (idHolder[data[destinySchool]]) {
                data[destinySchool] = <span>{idHolder[data[destinySchool]]}</span>
            } else {
                await getOuName(data[destinySchool]).then((res: any) => {
                    idHolder[data[destinySchool]] = res.results?.name
                    data[destinySchool] = <span>{res.results?.name}</span>
                })
            }

            if (idHolder[data.orgUnitId]) {
                data['sourceOUname'] = idHolder[data.orgUnitId]
            } else {
                await getOuName(data.orgUnitId).then((res: any) => {
                    idHolder[data[destinySchool]] = res.results?.name
                    data['sourceOUname'] = res.results?.name
                })
            }

            if (data[dataStoreData.transfer.status] === transferConst({ status: "pending" }))
                data['requestTime'] = getFormattedTimeDifference(data.registrationEventOccurredAt)
            else data['requestTime'] = '--'

            data[dataStoreData.transfer.status] = getComponent(data[dataStoreData.transfer.status], data, position == 'incoming', false)
        }

        console.log(tableData)
        setData(tableData)
        setLoading(false)
    }

    return { getOuDisplayName, loaading }
}
export default OuNameContainer
