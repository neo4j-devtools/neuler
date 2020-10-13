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
import {Link, Redirect, Route, Switch, useHistory, useRouteMatch} from "react-router-dom";
import {Button, List} from "semantic-ui-react";
import {SpecificTask} from "./SpecificTask";


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
