import React, {Component} from 'react'
import {Container, Divider, Icon, Loader, Message, Segment} from "semantic-ui-react"

import '../../App.css'
import CheckGraphAlgorithmsInstalled from "../CheckGraphAlgorithmsInstalled"
import CheckAPOCInstalled from "../CheckAPOCInstalled"
import NEuler from "../NEuler"
import {selectAlgorithm} from "../../ducks/algorithms"
import {connect} from "react-redux"

import {ConnectModal} from '../ConnectModal';

import {onNeo4jVersion} from "../../services/stores/neoStore"
import {loadMetadata, loadVersions} from "../../services/metadata"
import {
  setDatabases,
  setLabels,
  setNodePropertyKeys,
  setPropertyKeys,
  setRelationshipTypes,
  setVersions
} from "../../ducks/metadata"
import {CONNECTED, CONNECTING, DISCONNECTED, INITIAL, setConnected, setDisconnected} from "../../ducks/connection"
import {initializeDesktopConnection, initializeWebConnection, tryConnect} from "../../services/connections"
import {sendMetrics} from "../metrics/sendMetrics";
import {checkApocInstalled, checkGraphAlgorithmsInstalled} from "../../services/installation";
import {addDatabase, initLabel} from "../../ducks/settings";
import {selectCaption, selectRandomColor} from "../NodeLabel";
import {onConnected} from "./startup";
import {LoadingIcon} from "./LoadingIcon";
import {WebAppLoadingArea} from "./WebAppLoadingArea";
import {DesktopAppLoadingArea} from "./DesktopAppLoadingArea";


const ALL_DONE = "all-done";
const CONNECTING_TO_DATABASE = "database";
const CHECKING_GDS_PLUGIN = "gds";
const CHECKING_APOC_PLUGIN = "apoc";

const NewApp = (props) => {
  const [currentStep, setCurrentStep] = React.useState(CONNECTING_TO_DATABASE)
  const [currentStepFailed, setCurrentStepFailed] = React.useState(false)
  const [showNeuler, setShowNeuler] = React.useState(false)
  const { setConnected, setDisconnected, connectionInfo } = props

  React.useEffect(() => {
    initializeDesktopConnection(setConnected, setDisconnected, (error) => {
      setCurrentStepFailed(true)
    })
  }, [])

  React.useEffect(() => {
    if (props.connectionInfo.status === CONNECTED) {
      setCurrentStep(CHECKING_GDS_PLUGIN)
      setCurrentStepFailed(false)
      onConnected(props)
    }

  }, [props.connectionInfo.status])

  if(currentStep === ALL_DONE) {
    if(showNeuler) {
      return <NEuler key="app" {...props} />;
    } else {
      setTimeout(function () {
        setShowNeuler(true)
      }, 1500);
    }
  }

  return <Container fluid style={{display: 'flex'}}>
    <div style={{width: '100%'}}>
      <Segment basic inverted vertical={false} style={{height: '100vh'}}>
        <div style={{textAlign: "center"}}>
          <h1 className="loading">Launching NEuler - The Graph Data Science Playground</h1>
        </div>
        <Divider/>
        <div style={{textAlign: "center", paddingTop: "10px", display: "flex", justifyContent: "center"}}>
          <div className="loading">
            <LoadingIcon step={CONNECTING_TO_DATABASE} currentStep={currentStep}
                         currentStepFailed={currentStepFailed}/>
            <p>Connecting to database</p>
          </div>
          <div className="loading">
            <LoadingIcon step={CHECKING_GDS_PLUGIN} currentStep={currentStep}
                         currentStepFailed={currentStepFailed}/>
            <p>Checking GDS plugin</p>
          </div>
          <div className="loading">
            <LoadingIcon step={CHECKING_APOC_PLUGIN} currentStep={currentStep}
                         currentStepFailed={currentStepFailed}/>
            <p>Checking APOC plugin</p>
          </div>
        </div>

        <div style={{textAlign: "center"}}>
          <DesktopAppLoadingArea setDisconnected={setDisconnected} setConnected={setConnected}
                             connectionStatus={connectionInfo.status} currentStep={currentStep}
                             setCurrentStep={setCurrentStep} setCurrentStepFailed={setCurrentStepFailed}/>
        </div>

      </Segment>
    </div>
  </Container>
}


class App extends Component {
  steps = [
      CONNECTING_TO_DATABASE, CHECKING_GDS_PLUGIN, CHECKING_APOC_PLUGIN, ALL_DONE
  ]

  constructor(props) {
    super(props)

    this.state = {
      errorMsg: "Could not get a connection! Check that you entered the correct credentials and that the database is running.",
      currentStep: CONNECTING_TO_DATABASE,
      currentStepFailed: false
    }

    const { setConnected, setDisconnected } = this.props

    initializeDesktopConnection(setConnected, setDisconnected, (error) => this.setState({errorMsg: error}))
  }

  componentDidMount() {
    if (this.props.connectionInfo.status === CONNECTED) {
      this.onConnected()
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.connectionInfo !== nextProps.connectionInfo
      && nextProps.connectionInfo.status === CONNECTED) {
      this.setState({
        currentStep: CHECKING_GDS_PLUGIN,
        currentStepFailed: false
      })
      this.onConnected()
    }
  }

  onConnected() {
    onConnected(this.props)
  }

  renderIcon(step) {
    const {currentStep, currentStepFailed} = this.state

    const currentIndex = this.steps.indexOf(currentStep)
    const stepIndex = this.steps.indexOf(step)

    if(step === this.state.currentStep) {
      return currentStepFailed ?
          <Icon size="big" name='close' color='red' className="loading-icon" /> :
          <Loader active inline  className="loading-icon" size="large" />;
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
    const {currentStep} = this.state

    const placeholder =
      <Loader size='massive'>Checking plugin is installed</Loader>

    const tryingToConnect = <div style={{padding: "20px"}}>
      <Message grey attached header="Trying to connect" content="Trying to connect to active database. This should only take a few seconds. If it takes longer than that, check that you have a running database."/>
    </div>

    switch(currentStep) {
      case CONNECTING_TO_DATABASE:
        switch (connectionStatus) {
          case INITIAL:
          case DISCONNECTED:
              return tryingToConnect
          case CONNECTING:
            return tryingToConnect
          default:
            return tryingToConnect
        }
      case CHECKING_GDS_PLUGIN:
        return <CheckGraphAlgorithmsInstalled
            didNotFindPlugin={this.failedCurrentStep.bind(this)}
            gdsInstalled={this.gdsInstalled.bind(this)}>
          {placeholder}
        </CheckGraphAlgorithmsInstalled>;
      case CHECKING_APOC_PLUGIN:
        return <CheckAPOCInstalled
            didNotFindPlugin={this.failedCurrentStep.bind(this)}
            apocInstalled={this.apocInstalled.bind(this)}>
          {placeholder}
        </CheckAPOCInstalled>;
      case ALL_DONE:
        return <div style={{padding: "20px"}}>
          <Message color="grey" attached header="Neuler ready to launch" content="Connected to active database and all dependencies found. Neuler will launch shortly"/>
          </div>
      default:
        return <Message>Unknown State</Message>;
    }
  }

  failedCurrentStep(library) {
    this.setState(
        { currentStepFailed: true}
    )
  }

  gdsInstalled() {
    this.setState({
      currentStepFailed: false,
      currentStep: CHECKING_APOC_PLUGIN
    })
  }

  apocInstalled() {
    this.setState({
      currentStepFailed: false,
      currentStep: ALL_DONE
    })
  }


  render() {
    const {currentStep, showNeuler} = this.state

    if(currentStep === ALL_DONE) {
      if(showNeuler) {
        return <NEuler key="app" {...this.props} />;
      } else {
        const that = this;
        setTimeout(function () {
          that.setState({
            showNeuler: true
          });
        }, 1500);
      }
    }

    const {  connectionInfo } = this.props

    const extra = this.renderExtra(connectionInfo.status)

    return <Container fluid style={{display: 'flex'}}>
      <div style={{width: '100%'}}>
        <Segment basic inverted vertical={false} style={{height: '100vh'}}>
          <div style={{textAlign: "center"}}>
            <h1 className="loading">Launching NEuler - The Graph Data Science Playground</h1>
          </div>
          <Divider/>
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
  setNodePropertyKeys: propertyKeys => dispatch(setNodePropertyKeys(propertyKeys)),
  setGds: version => dispatch(setVersions(version)),
  setDatabases: databases => dispatch(setDatabases(databases)),
  setConnected: credentials => dispatch(setConnected(credentials)),
  setDisconnected: () => dispatch(setDisconnected()),

  addDatabase: database => dispatch(addDatabase(database)),
  initLabel: (database, label, color, propertyKeys) => dispatch(initLabel(database, label, color, propertyKeys))
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
