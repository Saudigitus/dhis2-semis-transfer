import React from 'react'
import { IconAddCircle24, Button } from "@dhis2/ui";
import Tooltip from '@material-ui/core/Tooltip';
import styles from './enrollmentActionsButtons.module.css'
import { useUrlParams } from 'dhis2-semis-functions';
import TabComponent from '../tabs/TabComponent';

function EnrollmentActionsButtons({ selectedValue, setSelectedValue }: { setSelectedValue: (args: any) => void, selectedValue: string }) {
    const { urlParameters } = useUrlParams();
    const { school: orgUnit } = urlParameters();

    return (
        <div className={styles.container}>
            <TabComponent selectedValue={selectedValue} setSelectedValue={setSelectedValue} />
            <Tooltip title={orgUnit === null ? "Please select an organisation unit before" : ""} >
                <Button className={styles.btn} disabled={!Boolean(orgUnit)} icon={<IconAddCircle24 />}>
                    <span className={styles.work_buttons_text}>Perform transfer</span>
                </Button>
            </Tooltip>
        </div>
    )
}

export default EnrollmentActionsButtons
