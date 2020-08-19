import React, {Component, useEffect, useState} from 'react'
import {Button, Header, Icon, Image, Loader, Menu, Message, Segment} from 'semantic-ui-react'
import {connect} from "react-redux"
import GraphVisualiser from './visualisation/GraphVisualiser'
import {getAlgorithmDefinitions} from "./algorithmsLibrary"
import Chart from './visualisation/Chart'
import CodeView from './CodeView'

import {ADDED, completeTask, FAILED, runTask} from "../ducks/tasks"
import html2canvas from "html2canvas";
import {ReImg} from 'reimg'
import {v4 as generateId} from 'uuid'

const tabContentStyle = {
  height: '85vh',
  overflowY: 'auto',
  overflowX: 'hidden'
}

const TableView = ({ task, gdsVersion }) => {
  const { ResultView } = getAlgorithmDefinitions(task.group, task.algorithm, gdsVersion)
  return <div style={tabContentStyle}>
    <ResultView task={task}/>
  </div>
}

const VisView = ({ task, active }) => (
  <div style={tabContentStyle}>
    <GraphVisualiser taskId={task.taskId} results={task.result} label={task.parameters.config.nodeProjection} active={active}
                     algorithm={task.algorithm}
                     limit={task.parameters.limit}
                     relationshipType={task.parameters.config.relationshipProjection.relType.type}
                     writeProperty={(task.parameters.config || {}).writeProperty}/>
  </div>
)

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
  constructor(props) {
    super(props);
    this.panelRef = React.createRef()
  }


  state = {
    activeItem: this.props.error ? 'Error' : 'Table'
  }

  handleMenuItemClick = (e, { name }) => {{
    if(!!window.neo4jDesktopApi) {
      window.neo4jDesktopApi.sendMetrics('neuler-click-view', name)
    }
    this.setState({ activeItem: name })
  }}

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

    return (
      <div>
        {task.completed && task.status === FAILED ? (
            <div>
              <Menu attached='top' tabular pointing secondary
                    style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex' }}>
                <Menu.Item name='Error' active={activeItem === 'Error'}
                           onClick={this.handleMenuItemClick.bind(this)}></Menu.Item>
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
            <Menu attached='top' tabular pointing secondary
                  style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex' }}>

                <Menu.Item name='Table' active={activeItem === 'Table'}
                           onClick={this.handleMenuItemClick.bind(this)}></Menu.Item>

                {activeGroup === 'Centralities' ?
                  <Menu.Item name='Chart' active={activeItem === 'Chart'}
                             onClick={this.handleMenuItemClick.bind(this)}></Menu.Item>
                  : null}

                {!(activeGroup === 'Path Finding' || activeGroup === 'Similarity') ?
                  <Menu.Item name='Visualisation' active={activeItem === 'Visualisation'}
                             onClick={this.handleMenuItemClick.bind(this)}></Menu.Item>
                  : null
                }

                <Menu.Item name='Code' active={activeItem === 'Code'}
                           onClick={this.handleMenuItemClick.bind(this)}></Menu.Item>

                <Menu.Item active={activeItem === 'Printscreen'}
                           onClick={(() => printElement(this.panelRef.current)).bind(this)}>
                  <Image src='images/Camera2.png'/>

                </Menu.Item>

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
            <div ref={this.panelRef}>
              <Segment attached='bottom'>
                <div style={getStyle('Table')}>
                  <TableView task={task} gdsVersion={this.props.gdsVersion}/>
                </div>

                <div style={getStyle('Code')}>
                  <CodeView task={task}/>
                </div>

                {!(activeGroup === 'Path Finding' || activeGroup === 'Similarity') ?
                  <div style={getStyle('Visualisation')}>
                    <VisView task={task} active={activeItem === 'Visualisation'}/>
                  </div> : null}

                {activeGroup === 'Centralities' ?
                  <div style={getStyle('Chart')}>
                    <ChartView task={task} active={activeItem === 'Chart'}/>
                  </div> : null}
              </Segment>
            </div>
          </React.Fragment>
        }
      </div>
    )
  }
}

const TabExampleVerticalTabular = (props) => {
  const [page, setPage] = useState(0)

  const prevResult = () => {
    setPage(Math.max(0, page - 1))
  }

  const nextResult = () => {
    const length = (props.tasks || []).length
    setPage(Math.min(length - 1, page + 1))
  }

  useEffect(() => {
    setPage(0)
    if(props.tasks.length > 0) {
      const task = props.tasks[0]
      if (task.status === ADDED) {
        onRunAlgo(task)
      }
    }
  }, [props.tasks.length])


  const onRunAlgo = (task) => {
    const {taskId, group, algorithm, parameters, persisted} = task
    const algorithmDefinition = getAlgorithmDefinitions(group, algorithm, props.metadata.versions.gdsVersion);
    const {service, getFetchQuery} = algorithmDefinition

    let fetchCypher

    let streamQuery = algorithmDefinition.streamQuery
    let storeQuery = algorithmDefinition.storeQuery

    if (group === "Similarity") {
      const {itemLabel, relationshipType, categoryLabel, weightProperty} = parameters
      streamQuery = streamQuery(itemLabel, relationshipType, categoryLabel, weightProperty)
      storeQuery = storeQuery(itemLabel, relationshipType, categoryLabel, weightProperty)

      fetchCypher = getFetchQuery(itemLabel, parameters.config.writeRelationshipType, parameters.config)
      delete parameters.itemLabel
      delete parameters.relationshipType
      delete parameters.categoryLabel
    } else {
      fetchCypher = getFetchQuery(parameters.label, parameters.config)
    }

    const params = { ...props.metadata.versions, taskId, algorithm, group}
    if(!!window.neo4jDesktopApi) {
      window.neo4jDesktopApi.sendMetrics('neuler-call-algorithm', algorithm, params)
    }

    service({
      streamCypher: streamQuery,
      storeCypher: storeQuery,
      fetchCypher,
      parameters,
      persisted
    }).then(result => {
      props.completeTask(taskId, result)
      if (persisted) {
        props.onComplete()
      }
    }).catch(exc => {
      console.log('ERROR IN SERVICE', exc)
      props.completeTask(taskId, [], exc.toString())

    })

    props.runTask(taskId, persisted ? [storeQuery, fetchCypher] : [streamQuery])
  }

  const tasks = props.tasks

  if (tasks && tasks.length > 0) {
    const currentTask = tasks[page]
    return <HorizontalAlgoTab
      task={currentTask}
      prevResult={prevResult.bind(this)}
      nextResult={nextResult.bind(this)}
      currentPage={page + 1}
      totalPages={tasks.length}
      gdsVersion={props.metadata.versions.gdsVersion}
    />
  } else {
    return null
  }
}


// class TabExampleVerticalTabular extends Component {
//   state = {
//     page: 0
//   }
//
//   prevResult() {
//     this.setState(({ page }) => ({ page: Math.max(0, page - 1) }))
//   }
//
//   nextResult() {
//     const length = (this.props.tasks || []).length
//     this.setState(({ page }) => ({ page: Math.min(length - 1, page + 1) }))
//   }
//
//   componentWillReceiveProps(nextProps, nextContext) {
//     if (nextProps.tasks.length !== this.props.tasks.length) {
//       this.setState({ page: 0 })
//       const task = nextProps.tasks[0]
//       if (task.status === ADDED) {
//         this.onRunAlgo(task)
//       }
//     }
//   }
//
//   onRunAlgo(task) {
//     const { taskId, group, algorithm, parameters, persisted } = task
//     const algorithmDefinition = getAlgorithmDefinitions(group, algorithm, this.props.metadata.versions.gdsVersion);
//     const { service, getFetchQuery } = algorithmDefinition
//
//     let fetchCypher
//
//     let streamQuery = algorithmDefinition.streamQuery
//     let storeQuery = algorithmDefinition.storeQuery
//
//     if (group === "Similarity") {
//       const { itemLabel, relationshipType, categoryLabel, weightProperty } = parameters
//       streamQuery = streamQuery(itemLabel, relationshipType, categoryLabel, weightProperty)
//       storeQuery = storeQuery(itemLabel, relationshipType, categoryLabel, weightProperty)
//
//       fetchCypher = getFetchQuery(itemLabel, parameters.config.writeRelationshipType, parameters.config)
//       delete parameters.itemLabel
//       delete parameters.relationshipType
//       delete parameters.categoryLabel
//     } else {
//       fetchCypher = getFetchQuery(parameters.label, parameters.config)
//     }
//
//
//     service({
//       streamCypher: streamQuery,
//       storeCypher: storeQuery,
//       fetchCypher,
//       parameters,
//       persisted
//     }).then(result => {
//       this.props.completeTask(taskId, result)
//       if (persisted) {
//         this.props.onComplete()
//       }
//     }).catch(exc => {
//       console.log('ERROR IN SERVICE', exc)
//       this.props.completeTask(taskId, [], exc.toString())
//
//     })
//
//     this.props.runTask(taskId, persisted ? [storeQuery, fetchCypher] : [streamQuery])
//   }
//
//   render() {
//     const tasks = this.props.tasks
//     const page = this.state.page
//     if (tasks && tasks.length > 0) {
//       const currentTask = tasks[this.state.page]
//       return <HorizontalAlgoTab
//         task={currentTask}
//         prevResult={this.prevResult.bind(this)}
//         nextResult={this.nextResult.bind(this)}
//         currentPage={page + 1}
//         totalPages={tasks.length}
//         gdsVersion={this.props.metadata.versions.gdsVersion}
//       />
//     } else {
//       return null
//     }
//   }
// }

const mapStateToProps = state => ({
  tasks: state.tasks,
  limit: state.settings.limit,
  metadata: state.metadata,
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

const printElement = element => {
  html2canvas(element).then(function (canvas) {
    const guid = generateId()
    ReImg.fromCanvas(canvas).downloadPng(`neuler-${guid}.png`);
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(TabExampleVerticalTabular)
