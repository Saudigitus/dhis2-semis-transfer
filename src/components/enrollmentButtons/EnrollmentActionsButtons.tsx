import React, { useState } from 'react'
import { IconAddCircle24, Button, ButtonStrip } from "@dhis2/ui";
import Tooltip from '@material-ui/core/Tooltip';
import styles from './enrollmentActionsButtons.module.css'
import { useGetSectionTypeLabel, useUrlParams } from 'dhis2-semis-functions';
import { Form } from "react-final-form";
import { RowSelectionState } from '../../schemas/selectedStaffsSchema';
import { useRecoilState } from 'recoil';
import TabComponent from '../tabs/TabComponent';

function EnrollmentActionsButtons({ selectedValue, setSelectedValue }: { setSelectedValue: (args: any) => void, selectedValue: string }) {
    const { urlParameters } = useUrlParams();
    const { school: orgUnit } = urlParameters();
    const { sectionName } = useGetSectionTypeLabel();
    const [openSaveModal, setOpenSaveModal] = useState<boolean>(false)
    const [selected, setSelected] = useRecoilState(RowSelectionState)

    return (
        <div className={styles.container}>
            <TabComponent selectedValue={selectedValue} setSelectedValue={setSelectedValue} />
            {/* <ButtonStrip className={styles.work_buttons}>
                <Tooltip title={orgUnit === null ? "Please select an organisation unit before" : ""}
                    onClick={() => setOpenSaveModal(true)}
                >
                    <span>
                        <Button disabled={selected?.length == 0} icon={<IconAddCircle24 />}>
                            <span className={styles.work_buttons_text}>Perform staff {sectionName.toLocaleLowerCase()} re-enroll</span>
                        </Button>
                    </span>
                </Tooltip>
            </ButtonStrip> */}
        </div>
    )
}

export default EnrollmentActionsButtons
