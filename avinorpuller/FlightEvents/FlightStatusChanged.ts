import {eventType} from "@dolittle/sdk.events";

@eventType('1844473f-d714-1327-017f-5b3c2bdfc305')
export class FlightStatusChanged {
    public constructor(readonly airport: string, readonly id: string, readonly status_code: string, readonly status_time: string) {
    }
}