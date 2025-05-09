import React from "react";
import style from './modalTransfer.module.css'
import { ModalComponent, useProgramsKeys, WithPadding } from "dhis2-semis-components";
import { ApproveTranferProps } from "../../types/modal/ModalProps";
import { useGetSectionTypeLabel, useUrlParams } from "dhis2-semis-functions";
import { useTransferTEI } from "../../hooks/tei/useTransfer";

function ApproveTranfer(props: ApproveTranferProps): React.ReactElement {
    const { modalDetails, setModalDetails } = props;
    const { urlParameters } = useUrlParams()
    const { school, schoolName } = urlParameters()
    const { sectionName } = useGetSectionTypeLabel();
    const programsValues = useProgramsKeys();
    const trackedEntityAttributes = programsValues?.[0]?.trackedEntityType?.trackedEntityTypeAttributes
    const programTrackedEntityAttributes = programsValues?.[0]?.programTrackedEntityAttributes
    const { loading, transferTEI, rejectTEI, loadingEvents } = useTransferTEI({ selectedTei: modalDetails.row, handleCloseApproval: () => setModalDetails({ open: false }) });

    const actions = [
        { id: "cancel", name: "Cancel", disabled: false, onClick: () => setModalDetails({ open: false }) },
        {
            id: "confirm", name: "Confirm", primary: true, loading: !!(loadingEvents || loading), disabled: !!(loadingEvents || loading), onClick: () => {
                if (modalDetails?.approved) {
                    transferTEI(school)
                } else {
                    rejectTEI()
                }
            }
        },
    ];

    return (
        <ModalComponent
            children={
                <WithPadding p="10px 0px">
                    {modalDetails?.approved
                        ? <span><span className="text-danger">Attention:</span> This action will transfer this {sectionName} into this school.</span>
                        : <span><span className="text-danger">Attention:</span> You are about to reject the {sectionName}&apos;s transfer to this school.</span>
                    }

                    <div className={style.divider}></div>

                    {modalDetails?.approved
                        ? <div className="py-2">
                            Are you sure you want to{" "} <span className="text-danger"> approve the transfer </span> of{" "}  <strong>{modalDetails?.row?.[trackedEntityAttributes[1]?.trackedEntityAttribute.id ?? programTrackedEntityAttributes[2]?.trackedEntityAttribute.id]} {modalDetails?.row?.[trackedEntityAttributes[0]?.trackedEntityAttribute?.id ?? programTrackedEntityAttributes[3]?.trackedEntityAttribute.id]} </strong>{" "} from{" "}
                            <strong>{modalDetails?.row?.sourceOUname}</strong>{" "} to{" "}
                            <strong>{schoolName}</strong>?
                        </div>
                        : <div className="py-2">
                            Are you sure you want to{" "} <span className="text-danger"> reject the transfer </span> of{" "}  <strong>{modalDetails?.row?.[trackedEntityAttributes[1]?.trackedEntityAttribute.id ?? programTrackedEntityAttributes[2]?.trackedEntityAttribute.id]} {modalDetails?.row?.[trackedEntityAttributes[0]?.trackedEntityAttribute?.id ?? programTrackedEntityAttributes[3]?.trackedEntityAttribute.id]}</strong>{" "} from{" "}
                            <strong>{modalDetails?.row?.sourceOUname}</strong>{" "} to{" "}
                            <strong>{schoolName}</strong>
                        </div>
                    }
                </WithPadding>
            }
            open={modalDetails.open}
            handleClose={() => setModalDetails({ open: false })}
            title="Transfer Approval"
            showActions
            size="large"
            actions={actions}
        />
    );
}

export default ApproveTranfer;
