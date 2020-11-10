import React from 'react';
import ReactDOM from 'react-dom';
import {persistReducer, persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {PersistGate} from 'redux-persist/integration/react'
import {Container, Dimmer, Loader} from 'semantic-ui-react'

import './index.css';
import * as serviceWorker from './serviceWorker';
import {createStore} from "redux"
import {connect, Provider} from 'react-redux'
import rootReducer from './ducks'
import WebApp from "./components/Startup/WebApp";
import  {Redirect, BrowserRouter as Router, Route, Switch} from "react-router-dom";
import AlgorithmsGroupMenu from "./components/AlgorithmGroupsMenu";
import {FeedbackForm} from "./components/Feedback/FeedbackForm";
import About from "./components/About";
import Datasets from "./components/Datasets";
import constants from "./constants";
import SelectDatabase from "./components/SelectDatabase";
import Home from "./components/Home";
import {selectGroup} from "./ducks/algorithms";
import {
    setActiveDatabase,
    setDatabases,
    setLabels,
    setNodePropertyKeys,
    setPropertyKeys,
    setRelationshipTypes, setVersions
} from "./ducks/metadata";
import {addDatabase, initLabel} from "./ducks/metadata";
import MainContent from "./components/MainContent";
import {NewAlgorithm} from "./components/NewAlgorithm";
import {refreshMetadata} from "./components/Startup/startup";
import {Recipe} from "./components/Recipe";

// Import apollo client nethods from services

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['settings']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = createStore(persistedReducer)
const persistor = persistStore(store)

// Check for global and setup apollo variables


const LoaderComponent = <Dimmer active>
    <Loader size='massive'>Connecting</Loader>
</Dimmer>

// const isNeo4jDesktop = !!window.neo4jDesktopApi
const isNeo4jDesktop = true

const App = WebApp

const RenderComponentView = (props) => {
    const {View, connectionInfo, routeProps, activeAlgorithm, activeGroup} = props
    if(!connectionInfo.credentials) {
        return <Redirect to="/login" />
    }
    const page = activeAlgorithm ?  `${constants.version}:${routeProps.location.pathname}:${activeGroup}/${activeAlgorithm}` : `${constants.version}:${routeProps.location.pathname}`
    const [aboutActive, setAboutActive] = React.useState(false)
    const [datasetsActive, setDatasetsActive] = React.useState(false)

    return <Container fluid style={{height: '100%', display: "flex", flexFlow: "column", background: "#fff"}}>
        <AlgorithmsGroupMenu metadata={props.metadata} setDatasetsActive={setDatasetsActive}
                             credentials={props.connectionInfo.credentials}/>
        <div style={{width: '100%', overflowY: 'auto', flexGrow: "1"}}>
            <View {...routeProps} setAboutActive={setAboutActive} setDatasetsActive={setDatasetsActive}  />
            <FeedbackForm page={page}/>
            <About open={aboutActive} onClose={() => setAboutActive(false)}/>
            <Datasets onComplete={() => refreshMetadata(props)} open={datasetsActive} onClose={() => setDatasetsActive(false)}/>
        </div>
    </Container>
}

const mapStateToProps = state => ({
    activeGroup: state.algorithms.group,
    activeAlgorithm: state.algorithms.algorithm,
    metadata: state.metadata,
    labels: state.metadata.allLabels,
    connectionInfo: state.connections,
})

const mapDispatchToProps = dispatch => ({
    selectGroup: group => dispatch(selectGroup(group)),
    setActiveDatabase: database => dispatch(setActiveDatabase(database)),
    setDatabases: databases => dispatch(setDatabases(databases)),
    setLabels: labels => dispatch(setLabels(labels)),
    setRelationshipTypes: relationshipTypes => dispatch(setRelationshipTypes(relationshipTypes)),
    setPropertyKeys: propertyKeys => dispatch(setPropertyKeys(propertyKeys)),
    setGds: version => dispatch(setVersions(version)),
    setNodePropertyKeys: propertyKeys => dispatch(setNodePropertyKeys(propertyKeys)),
    addDatabase: database => dispatch(addDatabase(database)),
    initLabel: (database, label, color, propertyKeys) => dispatch(initLabel(database, label, color, propertyKeys))
})

const RenderComponent = connect(mapStateToProps, mapDispatchToProps)(RenderComponentView)


ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={LoaderComponent} persistor={persistor}>
            <Router>
                <Switch>
                    <Route path="/recipes"
                           render={routeProps => (
                               <RenderComponent routeProps={routeProps} View={Recipe} />
                           )}
                    />
                    <Route path="/database"
                           render={routeProps => (
                               <RenderComponent routeProps={routeProps} View={SelectDatabase} />
                           )}/>

                    <Route path="/algorithms/new"
                           render={routeProps => (
                               <RenderComponent routeProps={routeProps} View={NewAlgorithm} />
                           )}/>

                    <Route path="/algorithms"
                           render={routeProps => (
                               <RenderComponent routeProps={routeProps} View={MainContent} />
                           )}/>

                    <Route path="/login"
                           render={routeProps => (
                               <App {...routeProps} isNeo4jDesktop={isNeo4jDesktop} />
                           )}/>
                    <Route path="/"
                           render={routeProps => (
                               <RenderComponent routeProps={routeProps} View={Home} />
                           )}/>

                </Switch>
            </Router>
        </PersistGate>
    </Provider>

    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
