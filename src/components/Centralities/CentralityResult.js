import React from 'react'
import {Button, Tab, Table} from "semantic-ui-react"
import PropertiesView from '../PropertiesView'

import { Loader } from 'semantic-ui-react'
import html2canvas from "html2canvas";
const LoaderExampleInlineCentered = () => <Loader active inline='centered'>Algorithm running</Loader>

export default ({ task }) => (
  <div>
  <Tab.Pane key={task.startTime.toLocaleString()} style={{ padding: '1em 0', borderTop: '0' }}>
    <Table color='green'>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Labels</Table.HeaderCell>
          <Table.HeaderCell>Properties</Table.HeaderCell>
          <Table.HeaderCell>Score</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
      { task.result ?
        task.result && task.result.map((result, idx) =>
          <Table.Row key={idx}>
            <Table.Cell>{result.labels.join(', ')}</Table.Cell>
            <Table.Cell> <PropertiesView properties={result.properties} labels={result.labels}/></Table.Cell>
            <Table.Cell>{result.score}</Table.Cell>
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
  </Tab.Pane>
  </div>
)
