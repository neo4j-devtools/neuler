import Chart from "../visualisation/Chart";
import React from "react";
import {Loader} from "semantic-ui-react";

const LoaderExampleInlineCentered = ({ active }) => <Loader active={active} inline='centered'>Fetching Data</Loader>

export const ChartView = ({task}) => {
    if (task.result && task.result.rows.length > 0) {
        return <Chart data={task.result.rows.map(result => ({
            name: result.properties.name || result.properties.title || result.properties.id || 'Node',
            score: result.score
        }))}/>
    } else {
        return <LoaderExampleInlineCentered active={true}/>
    }
}