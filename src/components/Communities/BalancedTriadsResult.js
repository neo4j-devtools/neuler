import React from 'react'
import { Tab, Table } from "semantic-ui-react"

export default ({ task }) => (
  <Tab.Pane key={task.startTime.toLocaleString()} style={{ padding: '1em 0' }}>
    <Table color='green'>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Labels</Table.HeaderCell>
          <Table.HeaderCell>Properties</Table.HeaderCell>
          <Table.HeaderCell>Balanced</Table.HeaderCell>
          <Table.HeaderCell>Unbalaanced</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {task.result && task.result.map((result, idx) =>
          <Table.Row key={idx}>
            <Table.Cell>{result.labels.join(', ')}</Table.Cell>
            <Table.Cell>{JSON.stringify(result.properties, null, 2)}</Table.Cell>
            <Table.Cell>{result.balanced}</Table.Cell>
            <Table.Cell>{result.unbalanced}</Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  </Tab.Pane>
)
