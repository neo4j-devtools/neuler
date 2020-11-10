import React from 'react'
import {Container, Divider, Segment} from "semantic-ui-react"
import NEuler from "../NEuler"
import '../../App.css'
import {selectAlgorithm, selectGroup} from "../../ducks/algorithms"
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
import {addDatabase, initLabel} from "../../ducks/metadata";
import {
  ALL_DONE,
  CHECKING_APOC_PLUGIN,
  CHECKING_GDS_PLUGIN,
  CONNECTING_TO_DATABASE,
  refreshMetadata,
  steps
} from "./startup";
import {LoadingIcon} from "./LoadingIcon";
import {DesktopAppLoadingArea} from "./DesktopAppLoadingArea";
import {FeedbackForm} from "../Feedback/FeedbackForm";
import constants from "../../constants";
import {Redirect} from "react-router-dom";


const NewApp = (props) => {
  const [currentStep, setCurrentStep] = React.useState(CONNECTING_TO_DATABASE)
  const [currentStepFailed, setCurrentStepFailed] = React.useState(false)
  const [showNeuler, setShowNeuler] = React.useState(false)
  const [metadataLoaded, setMetadataLoaded] = React.useState(false)
  const { setConnected, setDisconnected, connectionInfo } = props

  const [activeProject, setActiveProject] = React.useState(null)
  const [activeGraph, setActiveGraph] = React.useState(null)

  const [serverInfo, setServerInfo] = React.useState(null)

  React.useEffect(() => {
    props.selectGroup("Centralities")
    props.selectAlgorithm("Degree")
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
      setServerInfo(props.connectionInfo.credentials.username + "@" + props.connectionInfo.credentials.host)
    }

  }, [props.connectionInfo.status])

  React.useEffect(() => {
    if(currentStep === ALL_DONE) {
      refreshMetadata(props, true,() => setMetadataLoaded(true))
    }
  }, [currentStep])

  if (currentStep === ALL_DONE && metadataLoaded) {
    if (showNeuler) {
      return <Redirect to="/" />
    } else {
      setTimeout(function () {
        setShowNeuler(true)
      }, 1000);
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
        <FeedbackForm page={constants.version + "/DesktopApp-Startup" } />
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
  initLabel: (database, label, color, propertyKeys) => dispatch(initLabel(database, label, color, propertyKeys)),

  selectGroup: algorithm => dispatch(selectGroup(algorithm)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NewApp)
