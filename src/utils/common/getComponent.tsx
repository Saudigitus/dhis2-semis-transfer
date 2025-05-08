import React from "react";
import { Tooltip } from "@mui/material";
import { ButtonStrip, IconThumbUp24, IconThumbDown24 } from "@dhis2/ui"
import { IconButton } from "@material-ui/core";
import { useTransferConst } from "../../hooks/transferOptions/statusOptions";

export function useGetComponent({ setModalDetails, dataStore }: { setModalDetails: (value: any) => void, dataStore: any }) {
    const { transferConst } = useTransferConst({ dataStore })

    const getComponent = (option: any, row: any, incoming: boolean, disabled = false) => {

        const codeComponent = {
            [transferConst({ status: "pending" }) as string]: (
                <>
                    {
                        !incoming ? <h6 style={{ fontSize: "13px", color: "#000" }}>{option}</h6> :
                            <ButtonStrip>
                                <Tooltip title="Approve" placement="top" arrow>
                                    <IconButton
                                        size="small"
                                        style={{ color: "#4CAF50" }}
                                        onClick={() => { setModalDetails({ open: true, row, approved: true }) }}
                                        disabled={disabled}
                                    >
                                        <IconThumbUp24 />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Reject" placement="top" arrow>
                                    <IconButton
                                        size="small"
                                        style={{ color: "#E93710" }}
                                        onClick={() => { setModalDetails({ open: true, row, approved: false }) }}
                                        disabled={disabled}
                                    >
                                        <IconThumbDown24 />
                                    </IconButton>
                                </Tooltip>
                            </ButtonStrip>
                    }
                </>
            ),
            [transferConst({ status: "approved" }) as string]: <h6 style={{ fontSize: "13px", color: "#277314" }}>{option}</h6>,
            [transferConst({ status: "reproved" }) as string]: <h6 style={{ fontSize: "13px", color: "#D64D4D" }}>{option}</h6>
        }

        return <>
            {
                <Tooltip title={option}
                    componentsProps={{
                        tooltip: {
                            sx: { textTransform: 'capitalize' }
                        }
                    }}
                    disableHoverListener={option === 'Absense'}
                >
                    {codeComponent?.[option]}
                </Tooltip>
            }
        </>
    }

    return { getComponent }

}