import {connect} from "react-redux";
import {getCurrentAlgorithm} from "../ducks/algorithms";
import {addTask, completeTask, runTask} from "../ducks/tasks";
import {getActiveDatabase} from "../services/stores/neoStore";
import {
    setDatabases,
    setLabels,
    setNodePropertyKeys,
    setPropertyKeys,
    setRelationshipTypes,
    setVersions
} from "../ducks/metadata";
import {addDatabase, initLabel} from "../ducks/settings";
import {useHistory} from "react-router-dom";
import React from "react";
import {refreshMetadata} from "./Startup/startup";
import {constructNewTask, duplicateTask, onRunAlgo} from "../services/tasks";
import {Button} from "semantic-ui-react";
import {NewTopBar} from "./Results/SuccessTopBar";
import AlgorithmForm from "./AlgorithmForm";


export const NewAlgorithmView = (props) => {
    const history = useHistory();
    const [newTask, setNewTask] = React.useState(null)

    const onComplete = () => {
        refreshMetadata(props)
    }

    React.useEffect(() => {
        setNewTask(constructNewTask(props.activeGroup, props.activeAlgorithm, props.limit, props.communityNodeLimit, props.metadata.versions.gdsVersion))
    }, [props.activeGroup, props.activeAlgorithm])

    React.useEffect(() => {
        if (props.location.state) {
            const {group, algorithm, newParameters, formParameters} = props.location.state
            setNewTask(duplicateTask(group, algorithm, newParameters, formParameters))
        }
    }, [props.location.state])

    const addLimits = (params) => {
        return {
            ...params,
            limit: props.limit,
            communityNodeLimit: props.communityNodeLimit
        }
    }

    const {versions} = props.metadata

    const header = props.tasks && props.tasks.length > 0 ?
        <nav className="top-nav">
            <Button onClick={() => {

                history.push("/algorithms/")
            }} icon="left arrow" labelPosition="left" content="All algorithms" className="back-to-algorithms"/>
        </nav> : null

    return newTask && <div>
        {header}
        <div className="page-heading">
            New Algorithm Run
        </div>
        <div className="top-level-container">
            <NewTopBar/>
            <AlgorithmForm
                task={newTask}
                onComplete={onComplete}
                onRun={(newParameters, formParameters, persisted) => {
                    props.addTask(newTask.taskId, newTask.group, newTask.algorithm, addLimits(newParameters), formParameters, persisted)
                    onRunAlgo(newTask, newParameters, formParameters, persisted, versions, props.completeTask, onComplete, props.runTask)
                    history.push("/algorithms/" + newTask.taskId)
                }}
                onCopy={() => {}}
            />
        </div>
    </div>
}
export const NewAlgorithm = connect(state => ({
    tasks: state.tasks,
    limit: state.settings.limit,
    metadata: state.metadata,
    activeGroup: state.algorithms.group,
    activeAlgorithm: state.algorithms.algorithm,
    currentAlgorithm: getCurrentAlgorithm(state),
    communityNodeLimit: state.settings.communityNodeLimit,
}), (dispatch, ownProps) => ({
    runTask: (taskId, query, namedGraphQueries, parameters, formParameters, persisted) => {
        dispatch(runTask({taskId, query, namedGraphQueries, parameters, formParameters, persisted}))
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
        dispatch(addTask({...task}))
    },
    completeTask: (taskId, result, error) => {
        dispatch(completeTask({taskId, result, error}))
    },
    setGds: version => dispatch(setVersions(version)),
    setLabels: labels => dispatch(setLabels(labels)),
    setRelationshipTypes: relationshipTypes => dispatch(setRelationshipTypes(relationshipTypes)),
    setPropertyKeys: propertyKeys => dispatch(setPropertyKeys(propertyKeys)),
    setNodePropertyKeys: propertyKeys => dispatch(setNodePropertyKeys(propertyKeys)),
    setDatabases: databases => dispatch(setDatabases(databases)),
    addDatabase: database => dispatch(addDatabase(database)),
    initLabel: (database, label, color, propertyKeys) => dispatch(initLabel(database, label, color, propertyKeys)),
}))(NewAlgorithmView)
