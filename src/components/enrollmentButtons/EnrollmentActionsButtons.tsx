import React from 'react'
import { Tooltip } from '@mui/material';
import TabComponent from '../tabs/TabComponent';
import { IconAddCircle24, Button } from "@dhis2/ui";
import { useUrlParams } from 'dhis2-semis-functions';
import styles from './enrollmentActionsButtons.module.css'
import { useLocation, useNavigate } from 'react-router-dom';

function EnrollmentActionsButtons({ selectedValue, setSelectedValue }: { setSelectedValue: (args: any) => void, selectedValue: string }) {
    const { search } = useLocation()
    const navigate = useNavigate()
    const { urlParameters } = useUrlParams();
    const { school: orgUnit } = urlParameters();

    return (
        <div className={styles.container}>
            <TabComponent selectedValue={selectedValue} setSelectedValue={setSelectedValue} />
            <Tooltip title={orgUnit === null ? "Please select an organisation unit before" : ""} >
                <Button onClick={() => navigate(`/semis/transfer-execute${search}`)} className={styles.btn} disabled={!Boolean(orgUnit)} icon={<IconAddCircle24 />}>
                    <span className={styles.work_buttons_text}>Perform transfer</span>
                </Button>
            </Tooltip>
        </div>
    )
}

export default EnrollmentActionsButtons