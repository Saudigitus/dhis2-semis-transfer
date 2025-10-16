type StatusOptionsType = "approvedCode" | "penddingCode" | "reprovedCode" 
interface StatusOptionsProps {
    status: StatusOptionsType
}

export type { StatusOptionsProps }