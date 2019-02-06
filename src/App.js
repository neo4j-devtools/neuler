import React, { Component } from 'react'
import { Sidebar, Menu, Segment, Placeholder, Header } from "semantic-ui-react"

import './App.css'

import AlgorithmsGroupMenu from "./components/AlgorithmGroupsMenu"
import { selectAlgorithm } from "./ducks/algorithms"
import { connect } from "react-redux"
import { getAlgorithms } from "./components/algorithmsLibrary"
import MainContent from './components/MainContent'

import { ConnectModal } from './components/ConnectModal';

import { setDriver } from "./services/stores/neoStore"
import { loadLabels, loadRelationshipTypes } from "./services/metadata"
import { setLabels, setRelationshipTypes } from "./ducks/metadata"
import { setConnected, setDisconnected, CONNECTED, CONNECTING, DISCONNECTED, INITIAL } from "./ducks/connection"
import { initializeConnection, tryConnect } from "./services/connections"

class NEuler extends Component {

  constructor(props, context) {
    super(props, context);
  }

  state = {
    status: 'groups',
    content: 'centralities'
  }

  handleMenuClick (content) {
    this.setState({content})
  }

  render() {
    const { activeGroup, activeAlgorithm, selectAlgorithm } = this.props

    return (
      <Sidebar.Pushable as={Segment}>
        <Sidebar
          as={Menu}
          animation='push'
          direction='left'
          icon='labeled'
          inverted
          vertical
          visible={true}
          width='thin'
        >
          <AlgorithmsGroupMenu/>
        </Sidebar>

        <Sidebar.Pusher>
          <Segment basic inverted vertical={false} style={{ height: '5em', display: 'flex', width:'90%', justifyContent: 'space-between' }}>
            <Menu inverted>
              {getAlgorithms(activeGroup).map(algorithm =>
                <Menu.Item key={algorithm} as='a' active={activeAlgorithm === algorithm} onClick={() => selectAlgorithm(algorithm)}>
                  {algorithm}
                </Menu.Item>)}
            </Menu>
            <Header as='h1' inverted color='grey' style={{marginTop: '0'}}>
              NEuler
            </Header>
          </Segment>

          <MainContent />

        </Sidebar.Pusher>
      </Sidebar.Pushable>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props)

    const { setConnected, setDisconnected } = this.props
    initializeConnection(setConnected, setDisconnected)
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.connectionInfo !== nextProps.connectionInfo
      && nextProps.connectionInfo.status === CONNECTED) {
      loadLabels().then(this.props.setLabels)
      loadRelationshipTypes().then(this.props.setRelationshipTypes)
    }
  }

  render() {
    const { connectionInfo, setConnected } = this.props

    const placeholder = <Placeholder fluid>
      <Placeholder.Image rectangular/>
    </Placeholder>

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
        return <NEuler key="app" {...this.props} />
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
  setConnected: credentials => dispatch(setConnected(credentials)),
  setDisconnected: () => dispatch(setDisconnected())
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
