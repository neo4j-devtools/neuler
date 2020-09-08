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
          <Table.HeaderCell>Source Labels</Table.HeaderCell>
          <Table.HeaderCell>Source Properties</Table.HeaderCell>
          <Table.HeaderCell>Target Labels</Table.HeaderCell>
          <Table.HeaderCell>Target Properties</Table.HeaderCell>
          <Table.HeaderCell>Cost</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {task.result ?
          task.result && task.result.rows.length > 0 ? task.result.rows.map((result, idx) =>
          <Table.Row key={idx}>
            <Table.Cell>{result.sourceLabels.join(', ')}</Table.Cell>
            <Table.Cell> <PropertiesView properties={result.sourceProperties} labels={result.sourceLabels} database={task.database}/></Table.Cell>
            <Table.Cell>{result.targetLabels.join(', ')}</Table.Cell>
            <Table.Cell> <PropertiesView properties={result.targetProperties} labels={result.targetLabels} database={task.database}/></Table.Cell>
            <Table.Cell>{result.cost}</Table.Cell>
          </Table.Row>) :
              (<Table.Row key={"no-results"}>
            <Table.Cell colspan={3}>No results found</Table.Cell>
          </Table.Row>)
         :
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
