import React, {Component} from 'react'
import {Dimmer, Loader} from "semantic-ui-react"

import './App.css'
import CheckGraphAlgorithmsInstalled from "./components/CheckGraphAlgorithmsInstalled"
import NEuler from "./components/NEuler"
import {selectAlgorithm} from "./ducks/algorithms"
import {connect} from "react-redux"

import {ConnectModal} from './components/ConnectModal';

import {onNeo4jVersion, setDriver} from "./services/stores/neoStore"
import {loadMetadata, loadVersions} from "./services/metadata"
import {setDatabases, setLabels, setPropertyKeys, setRelationshipTypes, setVersions} from "./ducks/metadata"
import {CONNECTED, CONNECTING, DISCONNECTED, INITIAL, setConnected, setDisconnected} from "./ducks/connection"
import {initializeConnection, tryConnect} from "./services/connections"


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      errorMsg: "Could not get a connection!"
    }

    const { setConnected, setDisconnected } = this.props

    initializeConnection(setConnected, setDisconnected, (error) => this.setState({errorMsg: error}))
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
    loadVersions().then(versions => {
      this.props.setGds(versions)
      onNeo4jVersion(versions.neo4jVersion)
      loadMetadata(versions.neo4jVersion).then(metadata => {
        this.props.setLabels(metadata.labels)
        this.props.setRelationshipTypes(metadata.relationships)
        this.props.setPropertyKeys(metadata.propertyKeys)
        this.props.setDatabases(metadata.databases)
      })
    });
  }

  render() {
    const { connectionInfo, setConnected } = this.props

    const placeholder = <Dimmer active>
      <Loader size='massive'>Connecting</Loader>
    </Dimmer>


    switch (connectionInfo.status) {
      case INITIAL:
      case DISCONNECTED:
        if (!!window.neo4jDesktopApi) {
          return placeholder
        } else {
          return <ConnectModal
            key="modal"
            errorMsg={this.state.errorMsg}
            onSubmit={(username, password) => {
              const credentials = { username, password }
              tryConnect(credentials)
                .then(() => {
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
  connectionInfo: state.connections,
  metadata: state.metadata
})

const mapDispatchToProps = dispatch => ({
  selectAlgorithm: algorithm => dispatch(selectAlgorithm(algorithm)),
  setLabels: labels => dispatch(setLabels(labels)),
  setRelationshipTypes: relationshipTypes => dispatch(setRelationshipTypes(relationshipTypes)),
  setPropertyKeys: propertyKeys => dispatch(setPropertyKeys(propertyKeys)),
  setGds: version => dispatch(setVersions(version)),
  setDatabases: databases => dispatch(setDatabases(databases)),
  setConnected: credentials => dispatch(setConnected(credentials)),
  setDisconnected: () => dispatch(setDisconnected())
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
