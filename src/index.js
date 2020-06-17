import React from 'react';
import ReactDOM from 'react-dom';
import {persistStore, persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {PersistGate} from 'redux-persist/integration/react'
import {Loader, Dimmer} from 'semantic-ui-react'

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {createStore} from "redux"
import {Provider} from 'react-redux'
import rootReducer from './ducks'
import ApolloClient from 'apollo-boost';
import {getLink} from "./services/neo4jDesktop";
import {ApolloProvider} from '@apollo/react-hooks'

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
const isBrowser = window.neo4jDesktopApi === undefined
const link = getLink(isBrowser)

const client = new ApolloClient({
  uri: link,
  resolvers: {}
})

const LoaderComponent = <Dimmer active>
  <Loader size='massive'>Connecting</Loader>
</Dimmer>

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={LoaderComponent} persistor={persistor}>
      <ApolloProvider client={client}>
        <App/>
      </ApolloProvider>
    </PersistGate>
  </Provider>

  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
