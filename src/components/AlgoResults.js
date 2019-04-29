import React, { Component } from 'react'
import { Button, Header, Icon, Segment, Menu, Loader, Message } from 'semantic-ui-react'
import { connect } from "react-redux"
import GraphVisualiser from './visualisation/GraphVisualiser'
import GraphVisualiser2 from './visualisation/GraphVisualiser2'
import { getAlgorithmDefinitions } from "./algorithmsLibrary"
import Chart from './visualisation/Chart'
import CodeView from './CodeView'

import { ADDED, completeTask, FAILED, runTask } from "../ducks/tasks"

const tabContentStyle = {
  height: '85vh',
  overflowY: 'auto',
  overflowX: 'hidden'
}

const TableView = ({ task }) => {
  const { ResultView } = getAlgorithmDefinitions(task.group, task.algorithm)
  return <div style={tabContentStyle}>
    <ResultView task={task}/>
  </div>
}

const VisView = ({ task, active }) => (
  <div style={tabContentStyle}>
    <GraphVisualiser taskId={task.taskId} results={task.result} label={task.parameters.label} active={active}
                     algorithm={task.algorithm}
                     relationshipType={task.parameters.relationshipType}
                     writeProperty={(task.parameters.config || {}).writeProperty}/>
  </div>
)

class VisView2 extends Component {
  generateCypher(label, relationshipType) {
      return `match path = (node1${label ? ':' + label : ''})-[${relationshipType ? ':' + relationshipType : ''}]->(node2)
              return node1, node2`
  }

  render() {
    // Pass in the algorithm group and then we can choose what to pass through to the viz component

    const {task, active, group} = this.props


    const cypher = this.generateCypher(task.parameters.label, task.parameters.relationshipType)
    return (
      <div style={tabContentStyle}>
        <GraphVisualiser2 taskId={task.taskId} results={task.result} label={task.parameters.label} active={active}
                          algorithm={task.algorithm}
                          relationshipType={task.parameters.relationshipType}
                          cypher={cypher}
                          group={group}
                          writeProperty={(task.parameters.config || {}).writeProperty}/>
      </div>
    )
  }
}

const LoaderExampleInlineCentered = ({ active }) => <Loader active={active} inline='centered'>Fetching Data</Loader>


const ChartView = ({ task }) => {
  if (task.result && task.result.length > 0) {
    return <Chart data={task.result.map(result => ({
      name: result.properties.name || 'Node',
      score: result.score
    }))}/>
  } else {
    return <LoaderExampleInlineCentered active={true}/>
  }
}

class HorizontalAlgoTab extends Component {
  state = {
    activeItem: this.props.error ? 'Error' : 'Table'
  }

  handleMenuItemClick = (e, { name }) => this.setState({ activeItem: name })

  componentDidMount() {
    if (this.props.task.error) {
      this.setState({ activeItem: 'Error' })
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.task.error) {
      this.setState({ activeItem: 'Error' })
    } else if (this.state.activeItem === 'Error') {
      this.setState({ activeItem: 'Table' })
    }
  }

  render() {
    const { task, prevResult, nextResult, currentPage, totalPages } = this.props
    let activeItem = this.state.activeItem

    const activeGroup = task.group
    const getStyle = name => name === activeItem
      ? ({
        display: ''
      })
      : ({
        display: 'none'
      })

    const showView = (group, algorithm, view) => {
      if (group === "Path Finding") {
        if (view === "Chart") {
          return false
        } else if (view === "Viz2" || view === "Visualisation") {
          if (algorithm === "Single Source Shortest Path" || algorithm === "All Pairs Shortest Path") {
            return false
          }
        }
      } else if (group === "Similarity") {
        if (view === "Chart" || view === "Viz2" || view === "Visualisation") {
          return false
        }
      } else if (group === "Community Detection") {
        if (view === "Chart") {
          return false
        }
      }
      return true
    }

    const { group, algorithm} = task

    return (
      <div>
        {task.completed && task.status === FAILED ? (
            <div>
              <Menu attached='top' tabular>
                <Menu.Item name='Error' active={activeItem === 'Error'}
                           onClick={this.handleMenuItemClick.bind(this)}></Menu.Item>
                <Menu.Item name='Code' active={activeItem === 'Code'}
                           onClick={this.handleMenuItemClick.bind(this)}></Menu.Item>
              </Menu>
              <Segment attached='bottom'>
                <div style={getStyle('Error')}>
                  <Message warning>
                    <Message.Header>Algorithm failed to complete</Message.Header>
                    <p>{task.error}</p>
                  </Message>
                </div>
                <div style={getStyle('Code')}>
                  <CodeView task={task}/>
                </div>
              </Segment>
            </div>
          )
          : <React.Fragment>
            <Menu attached='top' tabular pointing secondary  style={{display: 'flex', justifyContent: 'space-between'}}>
              <div style={{display: 'flex'}}>

                <Menu.Item name='Table' active={activeItem === 'Table'}
                           onClick={this.handleMenuItemClick.bind(this)}></Menu.Item>

              {showView(group, algorithm, "Chart") ?
                <Menu.Item name='Chart' active={activeItem === 'Chart'}
                           onClick={this.handleMenuItemClick.bind(this)}></Menu.Item> : null}


              {showView(group, algorithm, "Visualisation") ?
                <Menu.Item name='Visualisation' active={activeItem === 'Visualisation'}
                           onClick={this.handleMenuItemClick.bind(this)}></Menu.Item>
                : null
              }

              {showView(group, algorithm, "Viz2") ?
                <Menu.Item name='Viz2' active={activeItem === 'Viz2'}
                           onClick={this.handleMenuItemClick.bind(this)}></Menu.Item>  : null}

                <Menu.Item name='Code' active={activeItem === 'Code'}
                  onClick={this.handleMenuItemClick.bind(this)}></Menu.Item>

              </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Button basic icon size='mini' onClick={prevResult} disabled={currentPage === 1}>
                    <Icon name='angle left'/>
                  </Button>
                  <Header as='h3' style={{ margin: '0 1em' }}>
                    {`${task.algorithm} Started at: ${task.startTime.toLocaleTimeString()} - (${currentPage} / ${totalPages})`}
                  </Header>
                  <Button basic icon size='mini' onClick={nextResult} disabled={currentPage === totalPages}>
                    <Icon name='angle right'/>
                  </Button>
                </div>


            </Menu>
            <Segment attached='bottom'>

              <div style={getStyle('Table')}>
                <TableView task={task}/>
              </div>

              <div style={getStyle('Code')}>
                <CodeView task={task}/>
              </div>


              {showView(group, algorithm, "Visualisation") ?
                <div style={getStyle('Visualisation')}>
                  <VisView task={task} active={activeItem === 'Visualisation'}/>
                </div> : null}

              {showView(group, algorithm, "Viz2")  ?
                <div style={getStyle('Viz2')}>
                  <VisView2 task={task} active={activeItem === 'Viz2'} group={activeGroup}/>
                </div> : null}

              {showView(group, algorithm, "Chart") ?
                <div style={getStyle('Chart')}>
                  <ChartView task={task} active={activeItem === 'Chart'}/>
                </div> : null}

            </Segment>
          </React.Fragment>
        }
      </div>
    )
  }
}

class TabExampleVerticalTabular extends Component {
  state = {
    page: 0
  }

  prevResult() {
    this.setState(({ page }) => ({ page: Math.max(0, page - 1) }))
  }

  nextResult() {
    const length = (this.props.tasks || []).length
    this.setState(({ page }) => ({ page: Math.min(length - 1, page + 1) }))
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.tasks.length !== this.props.tasks.length) {
      this.setState({ page: 0 })
      const task = nextProps.tasks[0]
      if (task.status === ADDED) {
        this.onRunAlgo(task)
      }
    }
  }

  onRunAlgo(task) {
    const { taskId, group, algorithm, parameters, persisted } = task
    let algorithmDefinition = getAlgorithmDefinitions(group, algorithm);
    const { service, getFetchQuery } = algorithmDefinition

    let fetchCypher = getFetchQuery(parameters.label)

    let streamQuery = algorithmDefinition.streamQuery
    let storeQuery = algorithmDefinition.storeQuery

    if (group === "Similarity") {
      const { itemLabel, relationshipType, categoryLabel } = parameters
      streamQuery = streamQuery(itemLabel, relationshipType, categoryLabel)
      storeQuery = storeQuery(itemLabel, relationshipType, categoryLabel)
      fetchCypher = getFetchQuery(itemLabel, parameters.config.writeRelationshipType)

      delete parameters.itemLabel
      delete parameters.relationshipType
      delete parameters.categoryLabel
    }

    service({
      streamCypher: streamQuery,
      storeCypher: storeQuery,
      fetchCypher,
      parameters: { ...parameters, limit: this.props.limit },
      persisted
    }).then(result => {
      this.props.completeTask(taskId, result)
      if (persisted) {
        this.props.onComplete()
      }
    }).catch(exc => {
      console.log('ERROR IN SERVICE', exc)
      this.props.completeTask(taskId, [], exc.toString())

    })

    this.props.runTask(taskId, persisted ? [storeQuery, fetchCypher] : [streamQuery])
  }

  render() {
    const tasks = this.props.tasks
    const page = this.state.page
    if (tasks && tasks.length > 0) {
      const currentTask = tasks[this.state.page]
      return <HorizontalAlgoTab
        task={currentTask}
        prevResult={this.prevResult.bind(this)}
        nextResult={this.nextResult.bind(this)}
        currentPage={page + 1}
        totalPages={tasks.length}
      />
    } else {
      return null
    }
  }
}

const mapStateToProps = state => ({
  tasks: state.tasks,
  limit: state.settings.limit
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  runTask: (taskId, query) => {
    dispatch(runTask({ taskId, query }))
  },
  completeTask: (taskId, result, error) => {
    dispatch(completeTask({ taskId, result, error }))
  },
  onComplete: () => {
    ownProps.onComplete()
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(TabExampleVerticalTabular)
