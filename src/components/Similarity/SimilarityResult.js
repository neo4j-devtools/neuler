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
          <Table.HeaderCell>From Labels</Table.HeaderCell>
          <Table.HeaderCell>From Properties</Table.HeaderCell>
          <Table.HeaderCell>To Labels</Table.HeaderCell>
          <Table.HeaderCell>To Properties</Table.HeaderCell>
          <Table.HeaderCell>Similarity</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {task.result ?
         task.result && task.result.map((result, idx) =>
          <Table.Row key={idx}>
            <Table.Cell>{result.fromLabels.join(', ')}</Table.Cell>
            <Table.Cell> <PropertiesView properties={result.fromProperties} labels={result.fromLabels}/></Table.Cell>
            <Table.Cell>{result.toLabels.join(', ')}</Table.Cell>
            <Table.Cell> <PropertiesView properties={result.toProperties} labels={result.toLabels}/></Table.Cell>
            <Table.Cell>{result.similarity}</Table.Cell>
          </Table.Row>
        ) :
        <Table.Row key="loading-centrality-result">
          <Table.Cell colSpan={5}>
            <LoaderExampleInlineCentered />
          </Table.Cell>
        </Table.Row>
}
      </Table.Body>
    </Table>
  </Tab.Pane>
)
