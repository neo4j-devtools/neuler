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
          <Table.HeaderCell>Node A Labels</Table.HeaderCell>
          <Table.HeaderCell>Node A Properties</Table.HeaderCell>
          <Table.HeaderCell>Node B Labels</Table.HeaderCell>
          <Table.HeaderCell>Node B Properties</Table.HeaderCell>
          <Table.HeaderCell>Node C Labels</Table.HeaderCell>
          <Table.HeaderCell>Node C Properties</Table.HeaderCell>

        </Table.Row>
      </Table.Header>
      <Table.Body>
        {task.result ?
         task.result && task.result.map((result, idx) =>
          <Table.Row key={idx}>
            <Table.Cell>{result.nodeALabels.join(', ')}</Table.Cell>
            <Table.Cell> <PropertiesView properties={result.nodeAProperties} labels={result.nodeALabels} database={task.database}/></Table.Cell>
            <Table.Cell>{result.nodeBLabels.join(', ')}</Table.Cell>
            <Table.Cell> <PropertiesView properties={result.nodeBProperties} labels={result.nodeBLabels} database={task.database}/></Table.Cell>
            <Table.Cell>{result.nodeCLabels.join(', ')}</Table.Cell>
            <Table.Cell> <PropertiesView properties={result.nodeCProperties} labels={result.nodeCLabels} database={task.database}/></Table.Cell>

          </Table.Row>
        ) :
        <Table.Row key="loading-centrality-result">
          <Table.Cell colSpan={6}>
            <LoaderExampleInlineCentered />
          </Table.Cell>
        </Table.Row>

}
      </Table.Body>
    </Table>
  </Tab.Pane>
)
