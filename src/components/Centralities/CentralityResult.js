import React from 'react'
import {Loader, Tab, Table} from "semantic-ui-react"
import PropertiesView from '../PropertiesView'

const LoaderExampleInlineCentered = () => <Loader active inline='centered'>Algorithm running</Loader>

export default ({ task }) => (
  <div>
    <Table color='green'>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Node</Table.HeaderCell>
          <Table.HeaderCell style={{textAlign: "right"}}>Score</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
      { task.result ?
        task.result && task.result.rows.map((result, idx) =>
          <Table.Row key={idx}>
            <Table.Cell> <PropertiesView properties={result.properties} labels={result.labels} database={task.database}/></Table.Cell>
            <Table.Cell style={{textAlign: "right"}}>{result.score}</Table.Cell>
          </Table.Row>
        )
          :
        <Table.Row key="loading-centrality-result">
          <Table.Cell colSpan={3}>
            <LoaderExampleInlineCentered />
          </Table.Cell>
        </Table.Row>
      }
      </Table.Body>
    </Table>
  </div>
)
