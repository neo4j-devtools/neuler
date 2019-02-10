import React from 'react'
import { Tab, Table } from "semantic-ui-react"

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
          <Table.HeaderCell>Node CS Properties</Table.HeaderCell>

        </Table.Row>
      </Table.Header>
      <Table.Body>
        {task.result && task.result.map((result, idx) =>
          <Table.Row key={idx}>
            <Table.Cell>{result.nodeALabels.join(', ')}</Table.Cell>
            <Table.Cell>{JSON.stringify(result.nodeAProperties, null, 2)}</Table.Cell>
            <Table.Cell>{result.nodeBLabels.join(', ')}</Table.Cell>
            <Table.Cell>{JSON.stringify(result.nodeBProperties, null, 2)}</Table.Cell>
            <Table.Cell>{result.nodeCLabels.join(', ')}</Table.Cell>
            <Table.Cell>{JSON.stringify(result.nodeCProperties, null, 2)}</Table.Cell>

          </Table.Row>
        )}
      </Table.Body>
    </Table>
  </Tab.Pane>
)
