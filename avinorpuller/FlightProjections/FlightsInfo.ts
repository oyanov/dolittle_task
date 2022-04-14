import { ProjectionContext, projection, on } from '@dolittle/sdk.projections';

import { FlightEvent } from '../FlightEvents/FlightEvent';
import {Flight} from "../Entities/Flight";
import {ClearFlights} from "../FlightEvents/ClearFlights";
import {FlightScheduleTimeChanged} from "../FlightEvents/FlightScheduleTimeChanged";
import {FlightStatusChanged} from "../FlightEvents/FlightStatusChanged";
import {FlightInfoChanged} from "../FlightEvents/FlightInfoChanged";

@projection('28f9db66-b6ca-4e5f-9fc3-638626c9e202')
export class FlightsInfo {
    name: string = 'Unknown';
    flights: { [key: string]: Flight} = {};

    @on(FlightEvent, _ => _.keyFromProperty('airport'))
    on(event: FlightEvent, projectionContext: ProjectionContext) {
        console.log(`Event Flight Added for the ${event.airport} with id ${event.flight.id}`)
        this.name = event.airport;
        if(event.flight.id in this.flights) {
            this.flights[event.flight.id] = {...this.flights[event.flight.id], ...event.flight}
        } else {
            this.flights[event.flight.id] = event.flight
        }
    }

    @on(ClearFlights, _ => _.keyFromProperty('airport'))
    onClear(event: ClearFlights, projectionContext: ProjectionContext) {
        console.log(`Event onClear: airport ${event.airport} with ${Object.keys(this.flights).length} flights`)
        this.flights = {}
    }

    @on(FlightScheduleTimeChanged, _ => _.keyFromProperty('airport'))
    onScheduleTimeChanged(event: FlightScheduleTimeChanged, projectionContext: ProjectionContext) {
        console.log(`Event onScheduleTimeChanged: airport ${event.airport}, id ${event.id}, time ${event.schedule_time}`)
        if(event.id in this.flights) {
            this.flights[event.id].schedule_time = event.schedule_time
        }
    }

    @on(FlightStatusChanged, _ => _.keyFromProperty('airport'))
    onStatusChanged(event: FlightStatusChanged, projectionContext: ProjectionContext) {
        console.log(`Event onStatusChanged: airport ${event.airport}, id ${event.id}, status code ${event.status_code}, status time ${event.status_time}`)
        if(event.id in this.flights) {
            this.flights[event.id].status_code = event.status_code
            this.flights[event.id].status_time = event.status_time
        }
    }

    @on(FlightInfoChanged, _ => _.keyFromProperty('airport'))
    onInfoChanged(event: FlightInfoChanged, projectionContext: ProjectionContext) {
        console.log(`Event onStatusChanged: airport ${event.airport}, id ${event.id}, belt ${event.belt}, delayed ${event.delayed}, check_in ${event.check_in}, gate ${event.gate}`)
        if(event.id in this.flights) {
            this.flights[event.id].belt = event.belt
            this.flights[event.id].delayed = event.delayed
            this.flights[event.id].check_in = event.check_in
            this.flights[event.id].gate = event.gate
        }
    }
}