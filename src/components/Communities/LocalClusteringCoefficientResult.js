import React from 'react'
import { Tab, Table } from "semantic-ui-react"
import PropertiesView from "../PropertiesView"

import { Loader } from 'semantic-ui-react'
const LoaderExampleInlineCentered = () => <Loader active inline='centered'>Algorithm running</Loader>


export default ({ task }) => (
  <Tab.Pane key={task.startTime.toLocaleString()} style={{ padding: '1em 0' }}>
    <Table color='green'>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Node</Table.HeaderCell>
          <Table.HeaderCell>Coefficient</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {task.result ?
         task.result && task.result.rows.map((result, idx) =>
          <Table.Row key={idx}>
            <Table.Cell> <PropertiesView properties={result.properties} labels={result.labels} database={task.database}/></Table.Cell>
            <Table.Cell>{result.coefficient}</Table.Cell>
          </Table.Row>
        ) :
        <Table.Row key="loading-centrality-result">
          <Table.Cell colSpan={4}>
            <LoaderExampleInlineCentered />
          </Table.Cell>
        </Table.Row>
}
      </Table.Body>
    </Table>
  </Tab.Pane>
)
