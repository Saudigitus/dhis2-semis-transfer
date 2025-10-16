import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { ButtonStrip, IconThumbUp24, IconThumbDown24 } from "@dhis2/ui"
import { useTransferConst } from "../../hooks/transferOptions/statusOptions";

export function useGetComponent({ setModalDetails, dataStore }: { setModalDetails: (value: any) => void, dataStore: any }) {
    const { transferConst } = useTransferConst({ dataStore })

    const getComponent = (option: { configKey: string, code: string }, row: any, incoming: boolean, disabled = false) => {

        const codeComponent = {
            [transferConst({ status: "penddingCode" }) as string]: (
                <>
                    {
                        !incoming ? <h6 style={{ fontSize: "13px", color: "#000" }}>{option?.code}</h6> :
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
            [transferConst({ status: "approvedCode" }) as string]: <h6 style={{ fontSize: "13px", color: "#277314" }}>{option?.code}</h6>,
            [transferConst({ status: "reprovedCode" }) as string]: <h6 style={{ fontSize: "13px", color: "#D64D4D" }}>{option?.code}</h6>,

        }

        return <>
            {
                <Tooltip title={option?.configKey}

                    componentsProps={{
                        tooltip: {
                            sx: { textTransform: 'capitalize' }
                        }
                    }}
                >
                    {codeComponent?.[option?.configKey] ?? option?.code}
                </Tooltip>
            }
        </>
    }

    return { getComponent }

}