import React from 'react'
import { Table, Tab, Header } from 'semantic-ui-react'
import { connect } from "react-redux"
import GraphVisualiser from './GraphVisualiser'
import CentralityResult from './Centralities/CentralityResult'

const getAlgoPanes = task => [{
  menuItem: `Table`,
  render: () => {
    switch (task.algorithm) {
      case 'Page Rank':
        return <CentralityResult task={task}/>
      default:
        return null
    }
  }
}, {
  menuItem: `Code`,
  render: () => <div>{Object.values(task.parameters).map(param => param.toString()).join(', ')}</div>
}, {
  menuItem: `Vis`,
  render: () => <GraphVisualiser taskId={task.taskId} results={task.result} label={task.parameters.label} relationshipType={task.parameters.relationshipType} writeProperty={task.parameters.writeProperty} />
}]

const getResultPanes = tasks => tasks.map(task =>
  ({
    menuItem: `${task.algorithm}. Started at: ${task.startTime.toLocaleString()}`,
    render: () => <HorizontalAlgoTab task={task} key={task.id}/>
  })
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