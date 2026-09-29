import React from 'react'
import { Tooltip } from '@mui/material';
import TabComponent from '../tabs/TabComponent';
import { IconAddCircle24, Button } from "@dhis2/ui";
import { useUrlParams } from 'dhis2-semis-functions';
import styles from './enrollmentActionsButtons.module.css'
import { useLocation, useNavigate } from 'react-router-dom';
import { D2I18n } from 'dhis2-semis-types';
import useGetSelectedKeys from '../../hooks/config/useGetSelectedKeys';
import ModuleWarning from '../warning/warning';

function EnrollmentActionsButtons({ i18n }: { i18n: D2I18n }) {
    const { search } = useLocation()
    const navigate = useNavigate()
    const { urlParameters } = useUrlParams();
    const { school: orgUnit } = urlParameters;
    const { dataStoreData } = useGetSelectedKeys()
    const { transfer } = dataStoreData
    const showWarning = !transfer?.destinySchool || !transfer?.originSchool || transfer?.destinySchool === transfer?.originSchool

    return (
        <div className={styles.container}>
            <TabComponent i18n={i18n} />

            {showWarning && <ModuleWarning />}

            <Tooltip title={orgUnit === null ? i18n.t("Please select an organisation unit before") : ""} >
                <Button
                    onClick={() => navigate(`/semis/transfer-execute${search}`)}
                    className={styles.btn}
                    disabled={!Boolean(orgUnit) || showWarning}
                    icon={<IconAddCircle24 />}
                >
                    <span className={styles.work_buttons_text}>{i18n.t("Perform transfer")}</span>
                </Button>
            </Tooltip>
        </div>
    )
}

export default EnrollmentActionsButtons