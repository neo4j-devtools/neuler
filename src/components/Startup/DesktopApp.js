import React from 'react'
import {Container, Divider, Segment} from "semantic-ui-react"

import '../../App.css'
import NEuler from "../NEuler"
import {selectAlgorithm} from "../../ducks/algorithms"
import {connect} from "react-redux"
import {
  setDatabases,
  setLabels,
  setNodePropertyKeys,
  setPropertyKeys,
  setRelationshipTypes,
  setVersions
} from "../../ducks/metadata"
import {CONNECTED, setConnected, setDisconnected} from "../../ducks/connection"
import {initializeDesktopConnection} from "../../services/connections"
import {addDatabase, initLabel} from "../../ducks/settings";
import {onConnected, steps, webAppSteps} from "./startup";
import {LoadingIcon} from "./LoadingIcon";
import {DesktopAppLoadingArea} from "./DesktopAppLoadingArea";
import {getDriver} from "../../services/stores/neoStore";

const ALL_DONE = "all-done";
const CONNECTING_TO_DATABASE = "database";
const CHECKING_GDS_PLUGIN = "gds";
const CHECKING_APOC_PLUGIN = "apoc";

const NewApp = (props) => {
  const [currentStep, setCurrentStep] = React.useState(CONNECTING_TO_DATABASE)
  const [currentStepFailed, setCurrentStepFailed] = React.useState(false)
  const [showNeuler, setShowNeuler] = React.useState(false)
  const { setConnected, setDisconnected, connectionInfo } = props

  const [activeProject, setActiveProject] = React.useState(null)
  const [activeGraph, setActiveGraph] = React.useState(null)

  const [serverInfo, setServerInfo] = React.useState(null)

  React.useEffect(() => {
    initializeDesktopConnection(setConnected, setDisconnected, () => {
      setCurrentStepFailed(true)
    }, setActiveProject, setActiveGraph, () => {
      setCurrentStepFailed(true)
    })
  }, [])

  React.useEffect(() => {
    if (props.connectionInfo.status === CONNECTED) {
      setCurrentStep(CHECKING_GDS_PLUGIN)
      setCurrentStepFailed(false)
      onConnected(props)
      getDriver().verifyConnectivity().then(value => setServerInfo(value.address))
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

  const smallStyle = {fontSize: "1.2rem", lineHeight: "20px", fontStyle: "italic"}

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
                         steps={steps}
                         currentStepFailed={currentStepFailed}/>
            <p>
              Connecting to database
            </p>
          </div>
          <div className="loading">
            <LoadingIcon step={CHECKING_GDS_PLUGIN} currentStep={currentStep}
                         steps={steps}
                         currentStepFailed={currentStepFailed}/>
            <p>Checking GDS plugin</p>
          </div>
          <div className="loading">
            <LoadingIcon step={CHECKING_APOC_PLUGIN} currentStep={currentStep}
                         steps={steps}
                         currentStepFailed={currentStepFailed}/>
            <p>Checking APOC plugin</p>
          </div>
        </div>

        <div style={{...smallStyle, paddingBottom: "10px", textAlign: "center", color: "#ccc"}}>
          <div style={smallStyle}>
            {serverInfo ? <React.Fragment>
              Connected to: {serverInfo} :: {activeProject}/{activeGraph}
            </React.Fragment> : null}
          </div>
        </div>

        <Divider />

        <div>
          <DesktopAppLoadingArea setDisconnected={setDisconnected} setConnected={setConnected}
                                 activeProject={activeProject} activeGraph={activeGraph}
                                 connectionStatus={connectionInfo.status} currentStep={currentStep}
                                 currentStepFailed={currentStepFailed}
                                 setCurrentStep={setCurrentStep} setCurrentStepFailed={setCurrentStepFailed}/>
        </div>

      </Segment>
    </div>
  </Container>
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

export default connect(mapStateToProps, mapDispatchToProps)(NewApp)
