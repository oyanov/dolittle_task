import {eventType} from "@dolittle/sdk.events";

@eventType('1844473f-d714-1327-017f-5b3c2bdfc303')
export class FlightInfoChanged {
    public constructor(readonly airport: string, readonly id: string, readonly delayed: string, readonly belt: string, readonly gate: string, readonly check_in: string) {
    }
}