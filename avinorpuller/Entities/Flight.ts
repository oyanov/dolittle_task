
export class Flight {
    id: string;
    airline: string;
    flight_id: string;
    dom_int: string;
    schedule_time: string;
    arr_dep: string;
    airport: string;
    check_in: string;
    gate: string;
    status_code: string;
    status_time: string;
    belt: string;
    delayed: string;

    public constructor(
        flight?: {
            id: string, airline: string, flight_id: string, dom_int: string, schedule_time: string, arr_dep: string, airport: string, check_in: string, gate: string, status: any, belt: string, delayed: string
        }) {

        if(flight){
                this.id = flight.id;
                this.airline = flight.airline;
                this.flight_id = flight.flight_id;
                this.dom_int = flight.dom_int;
                this.schedule_time = flight.schedule_time;
                this.arr_dep = flight.arr_dep;
                this.airport = flight.airport;
                this.check_in = flight.check_in;
                this.gate = flight.gate;
                this.status_code = flight.status && flight.status['$'].code;
                this.status_time = flight.status && flight.status['$'].time;
                this.belt = flight.belt;
                this.delayed = flight.delayed;
        }
    }
}
