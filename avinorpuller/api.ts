import {IDolittleClient} from "@dolittle/sdk/IDolittleClient";
import {DolittleClient} from "@dolittle/sdk";
import {TenantId} from "@dolittle/sdk.execution";
import {FlightsInfo} from "./FlightProjections/FlightsInfo";
import {CurrentStateType} from "@dolittle/sdk.projections/Distribution/Store/CurrentStateType";
const http = require("http");
const url = require('url');
const host = 'localhost';
const port = 8000;

let client: IDolittleClient;
(async () => { client = await DolittleClient.setup().connect();})();


const requestListener = function (req, res) {
    const queryData = url.parse(req.url, true).query;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (queryData.airport) {
        client.projections.forTenant(TenantId.development).getState(FlightsInfo, queryData.airport)
            .then(projection => {
                if(projection.type === CurrentStateType.Persisted) {
                    res.writeHead(200);
                    res.end(JSON.stringify(projection.state.flights));
                } else {
                    res.writeHead(204);
                    res.end()
                }
            })
    } else {
        res.writeHead(404);
        res.end()
    }
};

const api = http.createServer(requestListener);
api.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});