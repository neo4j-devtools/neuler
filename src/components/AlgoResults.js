import React from 'react'
import { Table, Tab, Header } from 'semantic-ui-react'
import { connect } from "react-redux"

const getAlgoPanes = task => [{
  menuItem: `Table`,
  render: () => <AlgoResultTab task={task}/>
}, {
  menuItem: `Code`,
  render: () => <div>{Object.values(task.parameters).map(param => param.toString()).join(', ')}</div>
}]

const getResultPanes = tasks => tasks.map(task =>
  ({
    menuItem: `${task.algorithm}. Started at: ${task.startTime.toLocaleString()}`,
    render: () => <HorizontalAlgoTab task={task}/>
  })
)

const AlgoResultTab = ({ task }) => (
  <Tab.Pane key={task.startTime.toLocaleString()}>
    <Table color='green'>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Labels</Table.HeaderCell>
          <Table.HeaderCell>Properties</Table.HeaderCell>
          <Table.HeaderCell>Page Rank</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {task.result && task.result.map((result, idx) =>
          <Table.Row key={idx}>
            <Table.Cell>{result.labels}</Table.Cell>
            <Table.Cell>{result.properties.toString()}</Table.Cell>
            <Table.Cell>{result.score}</Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  </Tab.Pane>
)

const TabExampleVerticalTabular = ({ tasks }) => (
  <div style={{ width: '95%' }}>
    <Header as='h2'>Run Results</Header>
    <Tab menu={{ fluid: true, vertical: true, tabular: true }} panes={getResultPanes(tasks)}/>
  </div>
)

const HorizontalAlgoTab = ({ task }) => (
  <div style={{ width: '95%' }}>
    <Tab menu={{ fluid: true, vertical: false, tabular: true }} panes={getAlgoPanes(task)}/>
  </div>
)


const mapStateProps = state => ({
  tasks: state.tasks
})

export default connect(mapStateProps, null)(TabExampleVerticalTabular)