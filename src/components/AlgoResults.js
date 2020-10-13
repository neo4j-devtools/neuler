import React, {useEffect, useState} from 'react'
import {Header, Message, Segment, Button, Grid, Menu} from 'semantic-ui-react'
import {connect} from "react-redux"
import {getAlgorithmDefinitions, getGroup} from "./algorithmsLibrary"
import CodeView, {constructQueries} from './CodeView'

import {ADDED, addTask, completeTask, FAILED, removeTask, runTask} from "../ducks/tasks"
import {sendMetrics} from "./metrics/sendMetrics";
import {FailedTopBar} from "./Results/FailedTopBar";
import {NavBar, SuccessTopBar} from "./Results/SuccessTopBar";
import {TableView} from "./Results/TableView";
import {VisView} from "./Results/VisView";
import {ChartView} from "./Results/ChartView";
import AlgorithmForm from "./AlgorithmForm";
import {v4 as generateTaskId} from "uuid";
import {getCurrentAlgorithm} from "../ducks/algorithms";
import {getActiveDatabase} from "../services/stores/neoStore";
import NewAlgorithmModal from "./NewAlgorithmModal";
import {onRunAlgo} from "../services/tasks";

export const tabContentStyle = {
  overflowY: 'auto',
  overflowX: 'hidden'
}

export const SingleTask = (props) => {
  const { task, currentPage, totalPages } = props

  const panelRef = React.createRef()
  const [activeItem, setActiveItem] = React.useState("Results")
  const [activeResultsItem, setActiveResultsItem] = React.useState("Table")

  const handleMenuItemClick = (e, { name }) => {
    sendMetrics('neuler-click-view', name)
    setActiveItem(name)
  }

  const handleResultsMenuItemClick = (e, {name}) => {
    sendMetrics('neuler-click-view', name)
    setActiveResultsItem(name)
  }

  React.useEffect(() => {
    if (task.status === ADDED) {
      setActiveItem("Configure")
    } else {
      setActiveItem("Results")
    }
  }, [task.status])

    const activeGroup = task.group
    const getStyle = name => name === activeItem ? {display: ''} : {display: 'none'}
    const getStyleResultsTab = name => name === activeItem ? {display: 'flex'} : {display: 'none'}
    const getResultsStyle = name => name === activeResultsItem ? {display: ''} : {display: 'none'}

  return (
      <div style={{padding: "10px"}}>
        {task.completed && task.status === FAILED ? (
                <React.Fragment>
                  <FailedTopBar task={task} activeItem={activeItem}
                                currentPage={currentPage} totalPages={totalPages} handleMenuItemClick={handleMenuItemClick.bind(this)}
                  />

                  <div style={{marginTop: "10px"}}>
                    <div style={getStyle("Configure")}>
                      <AlgorithmForm
                          task={task}
                          limit={props.limit}
                          onRun={(newParameters, formParameters, persisted) => {
                            props.onRunAlgo(task, newParameters, formParameters, persisted, props.gdsVersion)
                          }}
                          onCopy={(group, algorithm, newParameters, formParameters) => {
                            props.onCopyAlgo(group, algorithm, newParameters, formParameters)
                          }}
                      />
                    </div>
                    <div style={getStyle('Results')}>
                      <Message warning>
                        <Message.Header>Algorithm failed to complete</Message.Header>
                        <p>{task.error}</p>
                      </Message>
                    </div>
                    <div style={getStyle('Code')}>
                      <CodeView task={task}/>
                    </div>
                  </div>
                </React.Fragment>
          )
            : <React.Fragment>
                <SuccessTopBar task={task} activeItem={activeItem} activeGroup={activeGroup}
                               panelRef={panelRef} handleMenuItemClick={handleMenuItemClick}
                />
                <div ref={panelRef}>
                  <div>
                    <div style={getStyle("Configure")}>
                      <AlgorithmForm
                          task={task}
                          limit={props.limit}
                          onRun={(newParameters, formParameters, persisted) => {
                            props.onRunAlgo(task, newParameters, formParameters, persisted, props.gdsVersion)
                          }}
                          onCopy={(group, algorithm, newParameters, formParameters) => {
                            props.onCopyAlgo(group, algorithm, newParameters, formParameters)
                          }}
                      />
                    </div>

                    <div style={getStyle('Code')}>
                      <CodeView task={task}/>
                    </div>


                    <div style={getStyleResultsTab("Results")}>
                        <div>
                          <Menu pointing secondary vertical className="resultsMenu">
                            <Menu.Item
                                name='Table'
                                active={activeResultsItem === 'Table'}
                                onClick={handleResultsMenuItemClick}
                            />

                            {getGroup(task.algorithm) === "Centralities" &&
                            <Menu.Item
                                name='Chart'
                                active={activeResultsItem === 'Chart'}
                                onClick={handleResultsMenuItemClick}
                            />}

                            {!(getGroup(task.algorithm) === 'Path Finding' || getGroup(task.algorithm) === 'Similarity')  && <Menu.Item
                                name='Visualisation'
                                active={activeResultsItem === 'Visualisation'}
                                onClick={handleResultsMenuItemClick}
                            />}

                          </Menu>
                        </div>
                        <div style={{flexGrow: "1", paddingLeft: "10px"}}>
                          {!(activeGroup === 'Path Finding' || activeGroup === 'Similarity') ?
                              <div style={getResultsStyle('Visualisation')}>
                                <VisView task={task} active={activeResultsItem === 'Visualisation'}/>
                              </div> : null}

                          {activeGroup === 'Centralities' ?
                              <div style={getResultsStyle('Chart')}>
                                <ChartView task={task} active={activeResultsItem === 'Chart'}/>
                              </div> : null}

                          <div style={getResultsStyle('Table')}>
                            <TableView task={task} gdsVersion={props.gdsVersion}/>
                          </div>
                        </div>

                    </div>

                  </div>
                </div>

            </React.Fragment>
        }
      </div>
    )

}

const TabExampleVerticalTabular = (props) => {
  const [selectedTaskId, setSelectedTaskId] = useState(null)

  useEffect(() => {
    if(props.tasks.length > 0) {
      setSelectedTaskId(props.tasks[0].taskId)
    }
  }, [props.tasks.length === 0])

  const [newTask, setNewTask] = React.useState({})
  const constructNewTask = (activeGroup, activeAlgorithm) => {
    const taskId = generateTaskId()
    const addLimits = (params) => {
      return {
        ...params,
        limit: props.limit,
        communityNodeLimit: props.communityNodeLimit
      }
    }
    const {parameters, parametersBuilder} = getAlgorithmDefinitions(activeGroup, activeAlgorithm, props.metadata.versions.gdsVersion)

    const params = parametersBuilder({
      ...parameters,
      requiredProperties: Object.keys(parameters)
    })

    const formParameters = addLimits(parameters);

    return {
      group: activeGroup,
      algorithm: activeAlgorithm,
      taskId,
      parameters: params,
      formParameters,
      persisted: parameters.persist,
      startTime: new Date(),
      database: getActiveDatabase(),
      status: ADDED
    }
  }

  const addNewTask = (group, algorithm, parameters, formParameters) => {
    setNewAlgorithmFormOpen(true)
    const taskId = generateTaskId()
    const task = {
      group, algorithm, taskId,
      parameters, formParameters, persisted: parameters.persist,
      startTime: new Date(),
      database: getActiveDatabase(),
      status: ADDED
    }

    setNewTask(task)

  }


  const tasks = props.tasks

  const [newAlgorithmFormOpen, setNewAlgorithmFormOpen] = React.useState(false)

  React.useEffect(() => {
    setNewTask(constructNewTask(props.activeGroup, props.activeAlgorithm))
  }, [props.activeGroup, props.activeAlgorithm])

  if (tasks && tasks.length > 0) {
    const currentTask = selectedTaskId ? tasks.find(task => task.taskId === selectedTaskId) : tasks[0]
    return <div style={{width: "100%"}}>
      <nav style={{    background: "hsl(212, 33%, 89%)", padding: "5px", display: "flex"}}>
        <NavBar task={currentTask} tasks={tasks} setSelectedTaskId={setSelectedTaskId}  />
        <Button style={{margin: "4px", fontSize: "0.9rem", padding: ".6em 1.2em"}} onClick={() => {
          setNewTask(constructNewTask(props.activeGroup, props.activeAlgorithm))
          setNewAlgorithmFormOpen(true)
        }} primary>New algorithm</Button>
      </nav>
      <SingleTask
        metadata={props.metadata}
        onRunAlgo={onRunAlgo}
        onCopyAlgo={addNewTask}
        task={currentTask}
        totalPages={tasks.length}
        gdsVersion={props.metadata.versions.gdsVersion}
    />
      <NewAlgorithmModal
          open={newAlgorithmFormOpen}
          setOpen={setNewAlgorithmFormOpen}
          onRunAlgo={onRunAlgo}
          task={newTask}
      />
    </div>
  } else {
    return <div style={{
      width: "50%",
      margin: "auto",
      maxHeight: "300px",
      border: "1px black dashed",
      padding: "100px",
      textAlign: "center",
      position: "absolute",
      top: "50%",
      left: "50%",
      "-moz-transform": "translateX(-50%) translateY(-50%)",
      "-webkit-transform": "translateX(-50%) translateY(-50%)",
      transform: "translateX(-50%) translateY(-50%)"
    }}>

      <h1>No algorithms run yet</h1>

        <Button onClick={() => {
          setNewAlgorithmFormOpen(true)
        }} primary>Run algorithm</Button>

      <NewAlgorithmModal
          open={newAlgorithmFormOpen}
          setOpen={setNewAlgorithmFormOpen}
          onRunAlgo={onRunAlgo}
          task={newTask}
      />
    </div>
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
  },
  removeTask: (taskId) => {
    dispatch(removeTask({ taskId}))
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(TabExampleVerticalTabular)
