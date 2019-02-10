import React from 'react'
import { Tab, Table } from "semantic-ui-react"
import PropertiesView from "../PropertiesView"

export default ({ task }) => (
  <Tab.Pane key={task.startTime.toLocaleString()} style={{ padding: '1em 0' }}>
    <Table color='green'>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Labels</Table.HeaderCell>
          <Table.HeaderCell>Properties</Table.HeaderCell>
          <Table.HeaderCell>Community</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {task.result && task.result.map((result, idx) =>
          <Table.Row key={idx}>
            <Table.Cell>{result.labels.join(', ')}</Table.Cell>
            <Table.Cell> <PropertiesView properties={result.properties} labels={result.labels}/></Table.Cell>
            <Table.Cell>{result.community}</Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  </Tab.Pane>
)
