import { eventType } from '@dolittle/sdk.events';

@eventType('1844473f-d714-1327-017f-5b3c2bdfc301')
export class ClearFlights {
    public constructor(readonly airport: string) {
    }
}