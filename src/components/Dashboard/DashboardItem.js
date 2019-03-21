import React from 'react'
import { Card, Loader } from "semantic-ui-react"
import Chart from "../visualisation/Chart"

import CentralityResult from '../Centralities/CentralityResult'

export default ({ startTime, name, mode, result }) => <Card style={{ width: '30em' }}>
  <Card.Content>
    <Card.Header>{name}</Card.Header>
  </Card.Content>
  <Card.Content>
    {result
      ? (
        mode === 'chart'
          ? <Chart style={{ width: '30em', height: '25em' }} data={result.map(result => ({
        name: result.properties.name || 'Node',
        score: result.score
          }))}/>
          : <CentralityResult task={{ startTime, name, mode, result }}/>
      )
      : <Loader active={true} inline='centered'>Fetching Data</Loader>
    }
  </Card.Content>
</Card>