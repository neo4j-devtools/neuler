import React from 'react'
import {refreshMetadata} from "./Startup/startup";
import {addDatabase, initLabel, limit} from "../ducks/settings";
import {
    setDatabases,
    setLabels,
    setNodePropertyKeys,
    setPropertyKeys,
    setRelationshipTypes,
    setVersions
} from "../ducks/metadata";
import {connect} from "react-redux";
import {Link, Redirect, Route, Switch, useHistory, useParams, useRouteMatch} from "react-router-dom";
import {getCurrentAlgorithm} from "../ducks/algorithms";
import {addTask, completeTask, runTask} from "../ducks/tasks";
import {getActiveDatabase} from "../services/stores/neoStore";
import AlgorithmForm from "./AlgorithmForm";
import {constructNewTask, onRunAlgo} from "../services/tasks";
import {NavBar, NewTopBar} from "./Results/SuccessTopBar";
import {SingleTask} from "./AlgoResults";
import {Button, List, Icon} from "semantic-ui-react";
import {OpenCloseSection} from "./Form/OpenCloseSection";


export const NewAlgorithmView = (props) => {
    const history = useHistory();
    const [newTask, setNewTask] = React.useState(null)

    const onComplete = () => {
        refreshMetadata(props)
    }

    React.useEffect(() => {
        setNewTask(constructNewTask(props.activeGroup, props.activeAlgorithm, props.limit, props.communityNodeLimit, props.metadata.versions.gdsVersion))
    }, [props.activeGroup, props.activeAlgorithm])

    const addLimits = (params) => {
        return {
            ...params,
            limit: props.limit,
            communityNodeLimit: props.communityNodeLimit
        }
    }

    const { versions} = props.metadata


    const header = props.tasks && props.tasks.length > 0 ? <nav style={{  background: "hsl(212, 33%, 89%)", padding: "5px", display: "flex"}}>
        <Button onClick={() => {

            history.push("/algorithms/")
        }} icon="left arrow" labelPosition="left" content="All algorithms" className="back-to-algorithms" />
    </nav> : null

    return newTask && <div>
        {header}
    <div className="top-level-container">
        <NewTopBar />
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

export const NewAlgorithm =  connect(state => ({
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
        dispatch(completeTask({ taskId, result, error }))
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

const MainContent = (props) => {
    const history = useHistory();

    const mainStyle = {
        display: 'flex',
    }

    const onComplete = () => {
        refreshMetadata(props)
    }

    if(!props.tasks || props.tasks.length === 0 ) {
        return <Redirect to="/algorithms/new" />
    }

    let { path, url } = useRouteMatch();


    return <Switch>
        <Route exact path={path}>
            <div>
                <nav style={{  background: "hsl(212, 33%, 89%)", padding: "5px", display: "flex"}}>
                    <Button onClick={() => {
                    history.push("/algorithms/new")
                    }} icon="plus" labelPosition="right" content="New algorithm" primary />
                </nav>
                {props.tasks.map(task =>
                    <div className="algorithm-item" onClick={() => history.push("/algorithms/" + task.taskId)}>
                        <Link to={"/algorithms/" + task.taskId} >{task.group} / {task.algorithm}</Link>
                        <p className="start-time">
                            Started at: {task.startTime.toLocaleTimeString()}
                        </p>

                        <List className="algorithm-detail">
                            <List.Item >
                                <label>Node Projection</label>
                                <span>{task.parameters.config.nodeProjection}</span>
                            </List.Item>
                            <List.Item >
                                <label>Relationship Projection</label>
                                <span>{task.parameters.config.relationshipProjection.relType.type}, {task.parameters.config.relationshipProjection.relType.orientation} {task.parameters.config.relationshipWeightProperty ? ", " + task.parameters.config.relationshipWeightProperty : null  }</span>
                            </List.Item>

                        </List>

                    </div>)}
            </div>
        </Route>
        <Route path={`${path}/:taskId`}>
            <div>
                <nav style={{  background: "hsl(212, 33%, 89%)", padding: "5px", display: "flex"}}>
                    <Button onClick={() => {

                        history.push("/algorithms/")
                    }} icon="left arrow" labelPosition="left" content="All algorithms" className="back-to-algorithms" />
                    <Button onClick={() => {
                        history.push("/algorithms/new")
                    }} icon="plus" labelPosition="right" content="New algorithm" primary style={{marginLeft: "3px"}} />
                </nav>
                <SpecificTask tasks={props.tasks} />
            </div>
        </Route>
    </Switch>

    // return (
    //     <div style={mainStyle}>
    //         <div style={{width: '100%', justifyContent: "center", flexGrow: "1"}}>
    //             <AlgoResults onComplete={onComplete}/>
    //         </div>
    //     </div>
    // )

}

const SpecificTask = (props) => {
    const {tasks} = props

    const { taskId } = useParams();
    const currentTask = tasks.find(task => task.taskId === taskId)
    return <SingleTask
        metadata={props.metadata}
        onRunAlgo={onRunAlgo}
        // onCopyAlgo={addNewTask}
        task={currentTask}
        totalPages={tasks.length}
        gdsVersion="1.3"
    />
}

const mapStateToProps = state => ({
    activeMenuItem: state.menu.item,
    limit: state.settings.limit,
    communityNodeLimit: state.settings.communityNodeLimit,
    metadata: state.metadata,
    tasks: state.tasks,
})

const mapDispatchToProps = dispatch => ({
    updateLimit: value => dispatch(limit(value)),
    setLabels: labels => dispatch(setLabels(labels)),
    setGds: version => dispatch(setVersions(version)),
    setRelationshipTypes: relationshipTypes => dispatch(setRelationshipTypes(relationshipTypes)),
    setPropertyKeys: propertyKeys => dispatch(setPropertyKeys(propertyKeys)),
    setNodePropertyKeys: propertyKeys => dispatch(setNodePropertyKeys(propertyKeys)),
    setDatabases: databases => dispatch(setDatabases(databases)),
    addDatabase: database => dispatch(addDatabase(database)),
    initLabel: (database, label, color, propertyKeys) => dispatch(initLabel(database, label, color, propertyKeys)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MainContent)
