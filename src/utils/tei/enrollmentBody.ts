export function formatEnrollmentBody(program: any, events: any[], registrationEvent: any, newOu: any, transferEvent: any, tei: any, value: any, status: string) {
    let attributes = []

    for (const att of program?.programTrackedEntityAttributes) {
        if (tei?.[att.trackedEntityAttribute.id]) attributes.push({
            attribute: att.trackedEntityAttribute.id,
            value: tei?.[att.trackedEntityAttribute.id]
        })
    }

    const trackedEntities = [
        {
            orgUnit: newOu,
            trackedEntity: tei?.trackedEntity,
            trackedEntityType: tei?.trackedEntityType,
            enrollments: [
                {
                    orgUnit: newOu,
                    program: registrationEvent?.program,
                    status: "COMPLETED",
                    enrollment: registrationEvent?.enrollment,
                    attributes: tei?.attributes,
                    createdAt: registrationEvent?.createdAt,
                    occurredAt: registrationEvent?.occurredAt,
                    enrolledAt: registrationEvent?.occurredAt,
                    events: [
                        ...events?.filter(x => x != undefined)?.map((event: any) => ({
                            ...event,
                            orgUnit: newOu,
                        })),
                        {
                            ...transferEvent,
                            dataValues: [{ dataElement: status, value }]
                        }
                    ]
                }
            ]
        }
    ]

    return trackedEntities;
}