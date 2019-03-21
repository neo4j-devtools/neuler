import React from 'react'
import { Card, Loader } from "semantic-ui-react"
import Chart from "../visualisation/Chart"

export default ({ name, mode, result }) => <Card style={{width: '30em'}}>
  <Card.Content>
    <Card.Header>{name}</Card.Header>
  </Card.Content>
  <Card.Content>
    {result
      ? <Chart style={{width: '30em', height: '25em'}} data={result.map(result => ({
        name: result.properties.name || 'Node',
        score: result.score
      }))}/>
      : <Loader active={true} inline='centered'>Fetching Data</Loader>
    }
  </Card.Content>
</Card>