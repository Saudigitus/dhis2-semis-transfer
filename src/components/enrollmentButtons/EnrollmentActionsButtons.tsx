import React from 'react'
import Tooltip from '@material-ui/core/Tooltip';
import TabComponent from '../tabs/TabComponent';
import { IconAddCircle24, Button } from "@dhis2/ui";
import { useUrlParams } from 'dhis2-semis-functions';
import { Link, useLocation } from 'react-router-dom';
import styles from './enrollmentActionsButtons.module.css'

function EnrollmentActionsButtons({ selectedValue, setSelectedValue }: { setSelectedValue: (args: any) => void, selectedValue: string }) {
    const { search } = useLocation()
    const { urlParameters } = useUrlParams();
    const { school: orgUnit } = urlParameters();

    return (
        <div className={styles.container}>
            <TabComponent selectedValue={selectedValue} setSelectedValue={setSelectedValue} />
            <Link to={`semis/transfer-execute${search}`}>
                <Tooltip title={orgUnit === null ? "Please select an organisation unit before" : ""} >
                    <Button className={styles.btn} disabled={!Boolean(orgUnit)} icon={<IconAddCircle24 />}>
                        <span className={styles.work_buttons_text}>Perform transfer</span>
                    </Button>
                </Tooltip>
            </Link>
        </div>
    )
}

export default EnrollmentActionsButtons