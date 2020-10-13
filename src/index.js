import React from 'react';
import ReactDOM from 'react-dom';
import {persistReducer, persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {PersistGate} from 'redux-persist/integration/react'
import {Container, Dimmer, Loader} from 'semantic-ui-react'

import './index.css';
import DesktopApp from './components/Startup/DesktopApp';
import * as serviceWorker from './serviceWorker';
import {createStore} from "redux"
import {connect, Provider} from 'react-redux'
import rootReducer from './ducks'
import WebApp from "./components/Startup/WebApp";
import  {Redirect, BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Recipe} from "./components/Recipe";
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
    setRelationshipTypes
} from "./ducks/metadata";
import {addDatabase, initLabel} from "./ducks/settings";
import MainContent from "./components/MainContent";
import {NewAlgorithm} from "./components/NewAlgorithm";

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

const isNeo4jDesktop = !!window.neo4jDesktopApi
// const isNeo4jDesktop = true

const App = isNeo4jDesktop ? DesktopApp : WebApp

const RenderComponentView = ({view, connectionInfo}) => {
    if(!connectionInfo.credentials) {
        return <Redirect to="/login" />
    }

    const page = "test"
    const [aboutActive, setAboutActive] = React.useState(false)
    const [datasetsActive, setDatasetsActive] = React.useState(false)

    return <Container fluid style={{height: '100%', display: "flex", flexFlow: "column", background: "#fff"}}>
        <AlgorithmsGroupMenu setAboutActive={setAboutActive} setDatasetsActive={setDatasetsActive}/>
        <div style={{width: '100%', overflowY: 'auto', flexGrow: "1"}}>
            {view}
            <FeedbackForm page={page}/>
            <About open={aboutActive} onClose={() => setAboutActive(false)}/>
            <Datasets onComplete={() => {}} open={datasetsActive} onClose={() => setDatasetsActive(false)}/>
        </div>
    </Container>
}

const mapStateToProps = state => ({
    activeGroup: state.algorithms.group,
    metadata: state.metadata,
    labels: state.settings.labels,
    connectionInfo: state.connections,
})

const mapDispatchToProps = dispatch => ({
    selectGroup: group => dispatch(selectGroup(group)),
    setActiveDatabase: database => dispatch(setActiveDatabase(database)),
    setDatabases: databases => dispatch(setDatabases(databases)),
    setLabels: labels => dispatch(setLabels(labels)),
    setRelationshipTypes: relationshipTypes => dispatch(setRelationshipTypes(relationshipTypes)),
    setPropertyKeys: propertyKeys => dispatch(setPropertyKeys(propertyKeys)),
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
                               <RenderComponent view={<Recipe {...routeProps} />} />
                           )}
                    />
                    <Route path="/database"
                           render={routeProps => (
                               <RenderComponent view={<SelectDatabase {...routeProps} />} />
                           )}/>

                    <Route path="/algorithms/new"
                           render={routeProps => (
                               <RenderComponent view={<NewAlgorithm {...routeProps} />} />
                           )}/>

                    <Route path="/algorithms"
                           render={routeProps => (
                               <RenderComponent view={<MainContent {...routeProps} />} />
                           )}/>

                    <Route path="/login"
                           render={routeProps => (
                               <App {...routeProps} />
                           )}/>
                    <Route exact path="/"
                           render={routeProps => (
                               <RenderComponent view={<Home {...routeProps} />} />
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
