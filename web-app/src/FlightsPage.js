import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    Alert,
    Card,
    CardBody,
    Col,
    Container,
    Row,
    Input
} from "reactstrap";
import airportsInNorway from "./airports-in-norway.json";
import FlightsTable from "./FlightsTable";

function FlightsPage(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [requestError, setRequestError] = useState('');
    const [airport, setAirport] = useState('OSL');
    const [data, setData] = useState(null);
    const [timer, setTimer] = useState(0);
    const [filter, setFilter] = useState('');

    function getFlights(){
        setIsLoading(true)
        setRequestError(null);
        setData(null);
        axios.get(`http://localhost:8000?airport=${airport}`)
            .then(result => {
                if (result.status === 200 && !result.data.error) {
                    setData(Object.values(result.data).sort((a, b) => a.schedule_time > b.schedule_time ? -1 : 1));
                } else if (result.status === 204 ){
                    clearInterval(timer)
                } else {
                    setRequestError('Error occurred');
                }
                setIsLoading(false)
            }).catch(e => {
            setRequestError('Error occurred');
            setIsLoading(false)
        });
    }

    useEffect(() => {
        if(timer) clearInterval(timer)
        getFlights()
        setTimer(setInterval(getFlights, 1000*3*60))
    }, [airport]);

    function filterData(filter){
        if(!filter) return data
        return data.filter(f => f.airline.toLowerCase().indexOf(filter) !== -1 ||
            f.flight_id.toLowerCase().indexOf(filter) !== -1 ||
            f.airport.toLowerCase().indexOf(filter) !== -1 ||
            f.schedule_time.toLowerCase().indexOf(filter) !== -1 ||
            f.airline.toLowerCase().indexOf(filter) !== -1
        )
    }
    return  <Container>
        <Row>
            <Col sm={{ size: 12, offset: 0 }} md={{ size: 12, offset: 0 }}>
                <Card>
                    <CardBody>
                        <Row>
                            <Col sm={2}>Airports: </Col>
                            <Col sm={10}>
                                <Input type="select" name="selectStatus"
                                                       id='selectStatus'
                                                       defaultValue={airport}
                                                       onChange={(e) => {setAirport(e.target.value)}}>
                                {airportsInNorway.map((k) => ( <option key={k} value={k}>{k}</option>))}
                                </Input>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={2}>Filter: </Col>
                            <Col sm={10}>
                                <Input type="text" name="filter"
                                       id="filter"
                                       defaultValue=''
                                       onChange={ (e) => {setFilter(e.target.value.toLowerCase())} }/>
                            </Col>
                        </Row>
                        {data !== null && !isLoading && data.length === 0 && <Alert color="light">No Data Found</Alert>}
                        {requestError && <Row><Col> <Alert color="danger"> {requestError}</Alert></Col></Row> }
                        {isLoading && <Row><Col className='p-2'><h5>Loading...</h5></Col></Row> }
                        {data !== null && !isLoading && data.length > 0 &&
                            <FlightsTable data={filterData(filter)}/>
                        }
                    </CardBody>
                </Card>
            </Col>
        </Row>
    </Container>
}


export default FlightsPage;