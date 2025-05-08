import { useState } from "react";
import { useGetEvent } from "../events/useGetEvent";
import { getDataStoreKeys } from "../../utils/commons/dataStore/getDataStoreKeys";

export function useGetRegistrationEvent() {
    const { getEvent,  } = useGetEvent()
    const { program, registration } = getDataStoreKeys();

    const [loading, setLoading] = useState(false);
    const [registrationEvent, setRegistrationEvent] = useState()

    
    async function getRegistrationEvent(enrollment: string, trackedEntity: string) {
        setLoading(true)
        await getEvent(program, registration?.programStage as unknown as string, [], trackedEntity, "*")
        .then((response: any) => {
            const registrationEvent = response?.results?.instances?.filter((instance: any) => instance.enrollment === enrollment)[0]
            setRegistrationEvent(registrationEvent);        
        })
        setLoading(false)
    }


    return { registrationEvent, getRegistrationEvent, loading }
}
