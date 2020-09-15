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
import {addDatabase, initLabel} from "../../ducks/settings";
import {WebAppLoadingArea} from "./WebAppLoadingArea";
import {LoadingIcon} from "./LoadingIcon";
import {ALL_DONE, CHECKING_APOC_PLUGIN, CHECKING_GDS_PLUGIN, CONNECTING_TO_DATABASE, onConnected} from "./startup";

const NewApp = (props) => {
    const [currentStep, setCurrentStep] = React.useState(CONNECTING_TO_DATABASE)
    const [currentStepFailed, setCurrentStepFailed] = React.useState(true)
    const [showNeuler, setShowNeuler] = React.useState(false)
    const { setConnected, setDisconnected, connectionInfo } = props

    const [serverInfo, setServerInfo] = React.useState(null)

    React.useEffect(() => {
        if (props.connectionInfo.status === CONNECTED) {
            setCurrentStep(CHECKING_GDS_PLUGIN)
            setCurrentStepFailed(false)
            onConnected(props)
            setServerInfo(props.connectionInfo.credentials.username + "@" + props.connectionInfo.credentials.host)
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

    return <Container fluid style={{display: 'flex', height: '100%', overflowY: 'auto'}}>
        <div style={{width: '100%'}}>
            <Segment basic inverted vertical={false}>
                <div style={{textAlign: "center"}}>
                    <h1 className="loading">Launching NEuler - The Graph Data Science Playground</h1>
                </div>
                <Divider/>
                <div className="loading-wrapper">
                    <div className="loading">
                        <LoadingIcon step={CONNECTING_TO_DATABASE} currentStep={currentStep}
                                     currentStepFailed={currentStepFailed}/>
                        <p>Connecting to server

                        </p>
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

                <div style={{...smallStyle, paddingBottom: "10px", textAlign: "center", color: "#ccc"}}>
                        <div style={smallStyle}>
                            {serverInfo ? <React.Fragment>Connected to: {serverInfo}</React.Fragment> : null}
                        </div>
                </div>

                <Divider />

                <div>
                    <WebAppLoadingArea setDisconnected={setDisconnected} setConnected={setConnected}
                                       connectionStatus={connectionInfo.status} currentStep={currentStep}
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
