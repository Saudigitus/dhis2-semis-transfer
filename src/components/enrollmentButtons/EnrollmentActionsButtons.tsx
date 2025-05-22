import React from 'react'
import { IconAddCircle24, Button } from "@dhis2/ui";
import Tooltip from '@material-ui/core/Tooltip';
import styles from './enrollmentActionsButtons.module.css'
import { useUrlParams } from 'dhis2-semis-functions';
import TabComponent from '../tabs/TabComponent';
import { useConfig } from '@dhis2/app-runtime';

function EnrollmentActionsButtons({ selectedValue, setSelectedValue }: { setSelectedValue: (args: any) => void, selectedValue: string }) {
    const { urlParameters } = useUrlParams();
    const { school: orgUnit, sectionType, schoolName } = urlParameters();
    const { baseUrl } = useConfig();

    return (
        <div className={styles.container}>
            <TabComponent selectedValue={selectedValue} setSelectedValue={setSelectedValue} />
            <Tooltip title={orgUnit === null ? "Please select an organisation unit before" : ""} >
                <Button className={styles.btn} disabled={!Boolean(orgUnit)} icon={<IconAddCircle24 />}>
                    {/* <a href={`${baseUrl}/api/apps/SEMIS-Transfer-Execute/index.html#/transfer?sectionType=${sectionType}&school=${orgUnit}&schoolName=${schoolName}`}> */}
                    <span className={styles.work_buttons_text}>Request transfer</span>
                    {/* </a> */}
                </Button>
            </Tooltip>
        </div>
    )
}

export default EnrollmentActionsButtons
