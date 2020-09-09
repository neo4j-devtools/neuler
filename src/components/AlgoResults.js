import React, {Component, useEffect, useState} from 'react'
import {Loader, Message, Segment, Header} from 'semantic-ui-react'
import {connect} from "react-redux"
import {getAlgorithmDefinitions} from "./algorithmsLibrary"
import Chart from './visualisation/Chart'
import CodeView, {constructQueries} from './CodeView'

import {ADDED, addTask, COMPLETED, completeTask, FAILED, RUNNING, runTask} from "../ducks/tasks"
import {sendMetrics} from "./metrics/sendMetrics";
import {FailedTopBar} from "./Results/FailedTopBar";
import {SuccessTopBar} from "./Results/SuccessTopBar";
import {TableView} from "./Results/TableView";
import {VisView} from "./Results/VisView";
import {ChartView} from "./Results/ChartView";
import AlgorithmForm from "./AlgorithmForm";
import {v4 as generateTaskId} from "uuid";
import {getCurrentAlgorithm} from "../ducks/algorithms";
import {getActiveDatabase} from "../services/stores/neoStore";

export const tabContentStyle = {
  height: '85vh',
  overflowY: 'auto',
  overflowX: 'hidden'
}

class HorizontalAlgoTab extends Component {
  constructor(props) {
    super(props);
    this.panelRef = React.createRef()
  }


  state = {
    activeItem: "Configure"
  }

  handleMenuItemClick = (e, { name }) => {
    sendMetrics('neuler-click-view', name)
    this.setState({ activeItem: name })
  }

  componentDidMount() {
    if (this.props.task.error) {
      this.setState({ activeItem: 'Error' })
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
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
    const getStyle = name => name === activeItem ? {display: ''} : {display: 'none'}

    const currentAlgorithm = getAlgorithmDefinitions(task.group, task.algorithm, this.props.metadata.versions.gdsVersion)
    const { description } = currentAlgorithm

    return (
      <div style={{padding: "10px"}}>
        <Header as="h3">
          {task.algorithm}
          <Header.Subheader>
            {description}
          </Header.Subheader>
        </Header>
        {task.completed && task.status === FAILED ? (
                <React.Fragment>
                  <FailedTopBar task={task} activeItem={activeItem} prevResult={prevResult} nextResult={nextResult}
                                currentPage={currentPage} totalPages={totalPages} handleMenuItemClick={this.handleMenuItemClick.bind(this)}
                  />

                  <Segment attached='bottom'>
                    <div style={getStyle("Configure")}>
                      <AlgorithmForm
                          task={task}
                          limit={this.props.limit}
                          onRun={(newParameters, formParameters, persisted) => {
                            this.props.onRunAlgo(task, newParameters, formParameters, persisted)
                            this.handleMenuItemClick(null, {name: "Table"})
                          }} />
                    </div>
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
                </React.Fragment>
          )
            : <React.Fragment>
                <SuccessTopBar task={task} activeItem={activeItem} activeGroup={activeGroup} prevResult={prevResult}
                               nextResult={nextResult} currentPage={currentPage} totalPages={totalPages}
                               panelRef={this.panelRef} handleMenuItemClick={this.handleMenuItemClick.bind(this)}
                />
                <div ref={this.panelRef}>
                  <Segment attached='bottom'>
                    <div style={getStyle("Configure")}>
                      <AlgorithmForm
                          task={task}
                          limit={this.props.limit}
                          onRun={(newParameters, formParameters, persisted) => {
                            this.props.onRunAlgo(task, newParameters, formParameters, persisted)
                            this.handleMenuItemClick(null, {name: "Table"})
                          }} />
                    </div>


                    <React.Fragment>
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

                    </React.Fragment>
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
      // if (task.status === ADDED) {
      //   onRunAlgo(task)
      // }
    }
  }, [props.tasks.length])

  useEffect(() => {
    const taskId = generateTaskId()
    const {activeGroup, activeAlgorithm, metadata} = props

    const { parameters } = getAlgorithmDefinitions(activeGroup, activeAlgorithm, metadata.versions.gdsVersion)

    const addLimits = (params) => {
      return {
        ...params,
        limit: props.limit,
        communityNodeLimit: props.communityNodeLimit
      }
    }

    const { service, parametersBuilder } = props.currentAlgorithm
    if (service) {
      const params = parametersBuilder({
        ...parameters,
        requiredProperties: Object.keys(parameters)
      })

      const persisted = parameters.persist

      props.addTask(taskId, activeGroup, activeAlgorithm, addLimits(params), addLimits(parameters), persisted)
    }
  }, [JSON.stringify(props.currentAlgorithm)])


  const onRunAlgo = (task, parameters, formParameters, persisted) => {
    const {taskId, group, algorithm} = task
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
    sendMetrics('neuler-call-algorithm', algorithm, params)

    service({
      streamCypher: streamQuery,
      storeCypher: storeQuery,
      fetchCypher,
      parameters,
      persisted
    }).then(result => {
      sendMetrics('neuler', "completed-algorithm-call", params)
      props.completeTask(taskId, result)
      if (persisted) {
        props.onComplete()
      }
    }).catch(exc => {
      console.log('ERROR IN SERVICE', exc)
      props.completeTask(taskId, [], exc.toString())

    })

    const constructedQueries = constructQueries(algorithmDefinition, parameters, streamQuery)

    props.runTask(
        taskId,
        persisted ? [storeQuery, fetchCypher] : [streamQuery],
        persisted ?
            [constructedQueries.createGraph, constructedQueries.storeAlgorithmNamedGraph, fetchCypher, constructedQueries.dropGraph] :
            [constructedQueries.createGraph, constructedQueries.streamAlgorithmNamedGraph, constructedQueries.dropGraph],
        parameters,
        formParameters,
        persisted
    )
  }

  const tasks = props.tasks

  if (tasks && tasks.length > 0) {
    const currentTask = tasks[page]
    return <HorizontalAlgoTab
        metadata={props.metadata}
        onRunAlgo={onRunAlgo.bind(this)}
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

const mapStateToProps = state => ({
  tasks: state.tasks,
  limit: state.settings.limit,
  metadata: state.metadata,
  activeGroup: state.algorithms.group,
  activeAlgorithm: state.algorithms.algorithm,
  currentAlgorithm: getCurrentAlgorithm(state),
  communityNodeLimit: state.settings.communityNodeLimit,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  runTask: (taskId, query, namedGraphQueries, parameters, formParameters, persisted) => {
    dispatch(runTask({ taskId, query, namedGraphQueries, parameters, formParameters, persisted }))
  },
  completeTask: (taskId, result, error) => {
    dispatch(completeTask({ taskId, result, error }))
  },
  onComplete: () => {
    ownProps.onComplete()
  },
  addTask: (taskId, group, algorithm, parameters, formParameters, persisted) => {
    const task = {
      group,
      algorithm,
      taskId,
      parameters,
      formParameters,
      persisted,
      startTime: new Date(),
      database: getActiveDatabase()
    }
    dispatch(addTask({ ...task }))
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(TabExampleVerticalTabular)
