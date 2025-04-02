import {atom} from "recoil"

export const RowSelectionState = atom<any>({
    key: "get-selection-rows",
    default: []
})