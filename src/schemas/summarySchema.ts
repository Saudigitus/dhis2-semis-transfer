import { atom } from "recoil"

interface ReenrollSummaryProps {
    created: number | null
    conflicts: number | null
    conflictDetails: any
}

export const ReenrollSummaryState = atom<ReenrollSummaryProps>({
    key: "reenroll-summary",
    default: {
        created: null,
        conflicts: null,
        conflictDetails: null
    }
})