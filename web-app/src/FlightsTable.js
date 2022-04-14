import React from "react";
import {Table} from "reactstrap";
import moment from "moment";

function FlightsTable(props) {
    const data = props.data;
    return <Table size="sm" borderless hover responsive>
        <thead>
        <tr>
            <th>Date</th>
            <th>Airline</th>
            <th>Flight</th>
            <th>Time</th>
            <th>Type</th>
            <th>From/To</th>
            <th>Gate</th>
        </tr>
        </thead>
        <tbody>
        {data === null
            ? <tr>Loading...</tr>
            : data.map((row, index) => {
                return <tr key={index}>
                    <td>{moment(row.schedule_time).format('YYYY-MM-DD')}</td>
                    <td>{row.airline}</td>
                    <td>{row.flight_id}</td>
                    <td>{moment(row.schedule_time).format('HH:mm')}</td>
                    <td>{row.arr_dep === 'A' ? 'Arrival' : 'Departure'}</td>
                    <td>{row.airport}</td>
                    <td>{row.gate}</td>
                </tr>
            })}
        </tbody>
    </Table>
}

export default FlightsTable;