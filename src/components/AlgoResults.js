import React from 'react'
import { Table, Tab, Header } from 'semantic-ui-react'
import { connect } from "react-redux"

const getPanes = tasks => tasks.map(task =>
  ({
    menuItem: `${task.algorithm}. Started at: ${task.startTime.toLocaleString()}`, render: () => <Tab.Pane>
      <Table color='green'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Labels</Table.HeaderCell>
            <Table.HeaderCell>Properties</Table.HeaderCell>
            <Table.HeaderCell>Page Rank</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {task.result && task.result.map(result =>
            <Table.Row>
              <Table.Cell>{result.labels}</Table.Cell>
              <Table.Cell>{result.properties.toString()}</Table.Cell>
              <Table.Cell>{result.score}</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Tab.Pane>
  })
)

const TabExampleVerticalTabular = ({ tasks }) => (
  <div style={{ width: '95%' }}>
    <Header as='h2'>Run Results</Header>
    <Tab menu={{ fluid: true, vertical: true, tabular: true }} panes={getPanes(tasks)}/>
  </div>
)


const mapStateProps = state => ({
  tasks: state.tasks
})

export default connect(mapStateProps, null)(TabExampleVerticalTabular)