import React, {Component} from 'react'
import {Dimmer, Loader} from "semantic-ui-react"

import './App.css'
import CheckGraphAlgorithmsInstalled from "./components/CheckGraphAlgorithmsInstalled"
import NEuler from "./components/NEuler"
import {selectAlgorithm} from "./ducks/algorithms"
import {connect} from "react-redux"

import {ConnectModal} from './components/ConnectModal';

import {setDriver} from "./services/stores/neoStore"
import {loadMetadata} from "./services/metadata"
import {setLabels, setRelationshipTypes, setVersions} from "./ducks/metadata"
import {CONNECTED, CONNECTING, DISCONNECTED, INITIAL, setConnected, setDisconnected} from "./ducks/connection"
import {initializeConnection, tryConnect} from "./services/connections"

class App extends Component {
  constructor(props) {
    super(props)

    const { setConnected, setDisconnected } = this.props
    initializeConnection(setConnected, setDisconnected)
  }

  componentDidMount() {
    if (this.props.connectionInfo.status === CONNECTED) {
      this.onConnected()
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.connectionInfo !== nextProps.connectionInfo
      && nextProps.connectionInfo.status === CONNECTED) {
      this.onConnected()
    }
  }

  onConnected() {
    loadMetadata().then(metadata => {
      this.props.setLabels(metadata.labels)
      this.props.setRelationshipTypes(metadata.relationships)
      this.props.setGds(metadata.versions)
    })
  }

  render() {
    const { connectionInfo, setConnected } = this.props

    const placeholder = <Dimmer active>
      <Loader size='massive'>Connecting</Loader>
    </Dimmer>

    console.log('connectionInfo', connectionInfo)

    switch (connectionInfo.status) {
      case INITIAL:
      case DISCONNECTED:
        if (!!window.neo4jDesktopApi) {
          return placeholder
        } else {
          return <ConnectModal
            key="modal"
            errorMsg="Could not get a connection!"
            onSubmit={(username, password) => {
              const credentials = { username, password }
              tryConnect(credentials)
                .then(() => {
                  console.log("tryConnect - then", credentials)
                  setConnected(credentials)
                })
                .catch(setDisconnected)
            }}
            show={true}
          />
        }
      case CONNECTED:

        return (<CheckGraphAlgorithmsInstalled {...this.props}>
                  <NEuler key="app" {...this.props} />
                </CheckGraphAlgorithmsInstalled>)
      case
      CONNECTING:
        return placeholder
    }
  }
}

const mapStateToProps = state => ({
  activeGroup: state.algorithms.group,
  activeAlgorithm: state.algorithms.algorithm,
  connectionInfo: state.connections
})

const mapDispatchToProps = dispatch => ({
  selectAlgorithm: algorithm => dispatch(selectAlgorithm(algorithm)),
  setLabels: labels => dispatch(setLabels(labels)),
  setRelationshipTypes: relationshipTypes => dispatch(setRelationshipTypes(relationshipTypes)),
  setGds: version => dispatch(setVersions(version)),
  setConnected: credentials => dispatch(setConnected(credentials)),
  setDisconnected: () => dispatch(setDisconnected())
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
