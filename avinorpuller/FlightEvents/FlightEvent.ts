import { eventType } from '@dolittle/sdk.events';
import { Flight } from "../Entities/Flight";

@eventType('1844473f-d714-1327-017f-5b3c2bdfc302')
export class FlightEvent {
    public constructor(readonly airport: string, readonly lastUpdate: string, readonly flight: Flight) {
    }
}
