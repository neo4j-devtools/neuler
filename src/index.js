import React from 'react';
import ReactDOM from 'react-dom';
import {persistReducer, persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {PersistGate} from 'redux-persist/integration/react'
import {Dimmer, Loader} from 'semantic-ui-react'

import './index.css';
import DesktopApp from './components/Startup/DesktopApp';
import * as serviceWorker from './serviceWorker';
import {createStore} from "redux"
import {Provider} from 'react-redux'
import rootReducer from './ducks'
import WebApp from "./components/Startup/WebApp";

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

const app = isNeo4jDesktop ? <DesktopApp /> : <WebApp />

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={LoaderComponent} persistor={persistor}>
        {app}
    </PersistGate>
  </Provider>

  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
