import React from 'react'
import {refreshMetadata} from "./Startup/startup";
import {limit} from "../ducks/settings";
import {addDatabase, initLabel} from "../ducks/metadata";
import {
    setDatabases,
    setLabels,
    setNodePropertyKeys,
    setPropertyKeys,
    setRelationshipTypes,
    setVersions
} from "../ducks/metadata";
import {connect} from "react-redux";
import {Link, Redirect, Route, Switch, useHistory, useRouteMatch} from "react-router-dom";
import {Button, List} from "semantic-ui-react";
import {SpecificTask} from "./SpecificTask";
import {removeTask} from "../ducks/tasks";


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
                <nav className="top-nav">
                    <Button onClick={() => {
                    history.push("/algorithms/new")
                    }} icon="plus" labelPosition="right" content="New algorithm" className="new-algorithm" />
                </nav>

                <div className="page-heading">
                    Algorithm Runs
                </div>

                {props.tasks.map(task =>
                    <div className="algorithm-item" key={task.taskId}>
                        <Link to={"/algorithms/" + task.taskId} >{task.group} / {task.algorithm}</Link>

                        <Button onClick={() => {
                            props.removeTask(task.taskId)
                        }} icon="close" className="close" size="tiny" />

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
                <nav className="top-nav">
                    <Button onClick={() => {

                        history.push("/algorithms/")
                    }} icon="left arrow" labelPosition="left" content="All algorithms" className="back-to-algorithms" />
                    <Button onClick={() => {
                        history.push("/algorithms/new")
                    }} icon="plus" labelPosition="right" content="New algorithm"  style={{marginLeft: "3px"}} className="new-algorithm" />
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
    removeTask: (taskId) => {
        dispatch(removeTask({ taskId}))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(MainContent)
