import React from 'react'
import { Tab, Table } from "semantic-ui-react"
import PropertiesView from "../PropertiesView"

import { Loader } from 'semantic-ui-react'
const LoaderExampleInlineCentered = () => <Loader active inline='centered'>Algorithm running</Loader>

export default ({ task }) => (
  <Tab.Pane key={task.startTime.toLocaleString()} style={{ padding: '1em 0', borderTop: '0' }}>
    <Table color='green'>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Labels</Table.HeaderCell>
          <Table.HeaderCell>Properties</Table.HeaderCell>
          <Table.HeaderCell>Cost</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {task.result ?
          task.result && task.result.rows.length > 0 ? task.result.rows.map((result, idx) =>
          <Table.Row key={idx}>
            <Table.Cell>{result.labels.join(', ')}</Table.Cell>
            <Table.Cell> <PropertiesView properties={result.properties} labels={result.labels} database={task.database}/></Table.Cell>
            <Table.Cell>{result.cost}</Table.Cell>
          </Table.Row>) :
              (<Table.Row key={"no-results"}>
            <Table.Cell colspan={3}>No results found</Table.Cell>
          </Table.Row>)
         :
        <Table.Row key="loading-centrality-result">
          <Table.Cell colSpan={3}>
            <LoaderExampleInlineCentered />
          </Table.Cell>
        </Table.Row>
}
      </Table.Body>
    </Table>
  </Tab.Pane>
)
