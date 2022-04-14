const axios = require('axios')
const parseString = require('xml2js').parseString;
const airportsInNorway = require('./airports-in-norway.json')
const CronJob = require('cron').CronJob;
const getUrl = (airport: string, lastUpdate: string) => `https://flydata.avinor.no/XmlFeed.asp?TimeFrom=1&TimeTo=7&airport=${airport}&lastUpdate=${lastUpdate}`

import { DolittleClient, IDolittleClient } from '@dolittle/sdk';
import { TenantId } from '@dolittle/sdk.execution';

import { Flight } from "./Entities/Flight";
import {FlightEvent} from "./FlightEvents/FlightEvent";
import {ClearFlights} from "./FlightEvents/ClearFlights";
import {FlightScheduleTimeChanged} from "./FlightEvents/FlightScheduleTimeChanged";
import {FlightInfoChanged} from "./FlightEvents/FlightInfoChanged";
import {FlightStatusChanged} from "./FlightEvents/FlightStatusChanged";
let client: IDolittleClient
(async () => {
    client = await DolittleClient
        .setup()
        .connect();
})();

let lastUpdatedAirports: { [key: string]: string} = Object.assign({}, ...airportsInNorway.map((x: string) => ({[x]: ''})));
let flightsPerAirport = Object.assign({}, ...airportsInNorway.map((x: string) => ({[x]: {}})));

const job = new CronJob('* */3 * * * *', function() {
    for (const [airport, lastUpdate] of Object.entries(lastUpdatedAirports) ) {
        axios.get(getUrl(airport, lastUpdate))
            .then(res => {
                parseString(res.data, {explicitRoot:false, explicitArray:false}, (err, result) => {
                    lastUpdatedAirports[airport] = result.flights['$'].lastUpdate
                    if (result.flights.flight) {
                        processFlights(airport, lastUpdate, result.flights.flight.length ? result.flights.flight: [result.flights.flight])
                    }
                })
            })
            .catch(error => {
                console.error(error)
            })
    }
}, null, true);

job.start();

function processFlights(airport: string, lastUpdate: string, flights){
    if(!lastUpdate) { // first run
        client.eventStore.forTenant(TenantId.development).commit(new ClearFlights(airport), airport)
    }
    const storedFlights = flightsPerAirport[airport]
    for (const flight of flights){
        const id = flight['$'].uniqueID
        if (!(id in storedFlights)){
            storedFlights[id] = flight
            client.eventStore.forTenant(TenantId.development).commit(new FlightEvent(airport, lastUpdate, new Flight({...flight, id})), airport)
        } else {
            const cachedFlight = storedFlights[id]
            if (cachedFlight.schedule_time !== flight.schedule_time) {
                client.eventStore.forTenant(TenantId.development).commit(new FlightScheduleTimeChanged(airport, id, flight.schedule_time), airport)
            } else if(cachedFlight.delayed !== flight.delayed ||
                cachedFlight.belt !== flight.belt ||
                cachedFlight.gate !== flight.gate ||
                cachedFlight.check_in !== flight.check_in){
                client.eventStore.forTenant(TenantId.development).commit(new FlightInfoChanged(airport, id, flight.delayed, flight.belt, flight.gate, flight.check_in), airport)
            } else if(flight.status && (!cachedFlight.status || cachedFlight.status['$'].code !== flight.status['$'].code
                || cachedFlight.status['$'].time !== flight.status['$'].time)){
                client.eventStore.forTenant(TenantId.development).commit(new FlightStatusChanged(airport, id, flight.status['$'].code, flight.status['$'].time), airport)
            }
            storedFlights[id] = {...storedFlights[id], ...flight}
        }
    }
}