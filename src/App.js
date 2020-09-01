import React, {Component} from 'react'
import {Container, Dimmer, Divider, Icon, Loader, Segment} from "semantic-ui-react"

import './App.css'
import CheckGraphAlgorithmsInstalled from "./components/CheckGraphAlgorithmsInstalled"
import NEuler from "./components/NEuler"
import {selectAlgorithm} from "./ducks/algorithms"
import {connect} from "react-redux"

import {ConnectModal} from './components/ConnectModal';

import {onNeo4jVersion} from "./services/stores/neoStore"
import {loadMetadata, loadVersions} from "./services/metadata"
import {setDatabases, setLabels, setPropertyKeys, setRelationshipTypes, setVersions} from "./ducks/metadata"
import {CONNECTED, CONNECTING, DISCONNECTED, INITIAL, setConnected, setDisconnected} from "./ducks/connection"
import {initializeConnection, tryConnect} from "./services/connections"
import {sendMetrics} from "./components/metrics/sendMetrics";


const ALL_DONE = "all-done";
const CONNECTING_TO_DATABASE = "database";
const CHECKING_GDS_PLUGIN = "gds";
const CHECKING_APOC_PLUGIN = "apoc";

class App extends Component {
  steps = [
      CONNECTING_TO_DATABASE, CHECKING_GDS_PLUGIN, CHECKING_APOC_PLUGIN, ALL_DONE
  ]

  constructor(props) {
    super(props)

    this.state = {
      errorMsg: "Could not get a connection! Check that you entered the correct credentials and that the database is running.",
      currentStep: CONNECTING_TO_DATABASE
    }

    const { setConnected, setDisconnected } = this.props

    initializeConnection(setConnected, setDisconnected, (error) => this.setState({errorMsg: error}))
  }

  componentDidMount() {
    if (this.props.connectionInfo.status === CONNECTED) {
      this.onConnected()
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.connectionInfo !== nextProps.connectionInfo
      && nextProps.connectionInfo.status === CONNECTED) {
      this.onConnected()
    }
  }

  onConnected() {
    loadVersions().then(versions => {
      sendMetrics("neuler-connected", true, versions)

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

  renderIcon(step) {
    const {currentStep} = this.state

    const currentIndex = this.steps.indexOf(currentStep)
    const stepIndex = this.steps.indexOf(step)

    if(step === this.state.currentStep) {
      return <Loader active inline  className="loading-icon" size="large" />;
    } else {
      if(stepIndex > currentIndex) {
        return <Icon size="big" name='circle notch' color='grey' className="loading-icon" />
      } else {
        return <Icon size="big" name='checkmark' color='green' className="loading-icon" />
      }
    }
  }

  renderExtra(connectionStatus) {
    const {setConnected} = this.props

    const placeholder = <Dimmer active>
      <Loader size='massive'>Connecting to active database</Loader>
    </Dimmer>

    const connectModal = <ConnectModal
        key="modal"
        errorMsg={this.state.errorMsg}
        onSubmit={(username, password) => {
          const credentials = {username, password}
          tryConnect(credentials)
              .then(() => {
                this.setState({
                  step: CHECKING_GDS_PLUGIN
                })
                setConnected(credentials)
              })
              .catch(setDisconnected)
        }}
        show={true}
    />
    switch (connectionStatus) {
      case INITIAL:
      case DISCONNECTED:
        if (!!window.neo4jDesktopApi) {
          return placeholder
        } else {
          return connectModal
        }
      case
      CONNECTING:
        return placeholder
      default:
        return placeholder
    }
  }

  render() {
    const {currentStep} = this.state
    if(currentStep === ALL_DONE) {
      return <NEuler key="app" {...this.props} />;
    }
    const {  connectionInfo } = this.props

    const extra = this.renderExtra(connectionInfo.status)

    return <Container fluid style={{display: 'flex'}}>
      <div style={{width: '100%'}}>
        <Segment basic inverted vertical={false}
                 style={{height: '100vh' }}>
          <div style={{textAlign: "center"}}>
            <h1 className="loading">Launching NEuler - The Graph Data Science Playground</h1>
          </div>
          <Divider />
          <div style={{textAlign: "center", paddingTop: "10px", display: "flex", justifyContent: "center"}}>
            <div className="loading">
              {this.renderIcon(CONNECTING_TO_DATABASE)}
              <p>Connecting to database</p>
            </div>
            <div className="loading">
              {this.renderIcon(CHECKING_GDS_PLUGIN)}

              <p>Checking GDS plugin</p>
            </div>
            <div className="loading">
              {this.renderIcon(CHECKING_APOC_PLUGIN)}
              <p>Checking APOC plugin</p>
            </div>
          </div>

          <div style={{textAlign: "center"}}>
            {extra}
          </div>

        </Segment>
      </div>
    </Container>
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
