import React from 'react'
import { Tab, Table } from "semantic-ui-react"
import PropertiesView from "../../PropertiesView"

import { Loader } from 'semantic-ui-react'
const LoaderExampleInlineCentered = () => <Loader size='big' active inline='centered'>Algorithm running</Loader>

export default ({ task }) => (
  <Tab.Pane key={task.startTime.toLocaleString()} style={{ padding: '1em 0' }}>
    <Table color='green'>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Communities</Table.HeaderCell>
          <Table.HeaderCell>Size</Table.HeaderCell>
          <Table.HeaderCell>Nodes</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {task.result ?
         task.result && task.result.rows.map((result, idx) =>
          <Table.Row key={idx}>
            <Table.Cell>{result.communities}</Table.Cell>
            <Table.Cell>{result.size}</Table.Cell>
            <Table.Cell>
              {result.nodes.map((node, index) => <PropertiesView key={index} properties={node.properties} labels={node.labels} database={task.database}/>)}
            </Table.Cell>

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
