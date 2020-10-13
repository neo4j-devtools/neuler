import React, {useEffect, useState} from 'react'
import {Button} from 'semantic-ui-react'
import {connect} from "react-redux"
import {getAlgorithmDefinitions} from "./algorithmsLibrary"

import {ADDED, addTask, completeTask, removeTask, runTask} from "../ducks/tasks"
import {NavBar} from "./Results/SuccessTopBar";
import {v4 as generateTaskId} from "uuid";
import {getCurrentAlgorithm} from "../ducks/algorithms";
import {getActiveDatabase} from "../services/stores/neoStore";
import NewAlgorithmModal from "./NewAlgorithmModal";
import {onRunAlgo} from "../services/tasks";
import {SingleTask} from "./SingleTask";

export const tabContentStyle = {
  overflowY: 'auto',
  overflowX: 'hidden'
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
