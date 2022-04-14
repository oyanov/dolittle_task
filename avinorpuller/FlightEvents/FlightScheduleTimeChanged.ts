import {eventType} from "@dolittle/sdk.events";

@eventType('1844473f-d714-1327-017f-5b3c2bdfc304')
export class FlightScheduleTimeChanged {
    public constructor(readonly airport: string, readonly id: string, readonly schedule_time: string) {
    }
}