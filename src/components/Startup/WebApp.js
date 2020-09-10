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
import {initializeWebConnection} from "../../services/connections"
import {addDatabase, initLabel} from "../../ducks/settings";
import {LoadingArea} from "./LoadingArea";
import {LoadingIcon} from "./LoadingIcon";
import {
    ALL_DONE,
    CHECKING_APOC_PLUGIN,
    CHECKING_GDS_PLUGIN,
    CONNECTING_TO_DATABASE,
    onConnected
} from "./startup";

const NewApp = (props) => {
    const [currentStep, setCurrentStep] = React.useState(CONNECTING_TO_DATABASE)
    const [currentStepFailed, setCurrentStepFailed] = React.useState(false)
    const [showNeuler, setShowNeuler] = React.useState(false)
    const { setConnected, setDisconnected, connectionInfo } = props

    React.useEffect(() => {
        initializeWebConnection(setConnected, setDisconnected, (error) => {
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
                    <LoadingArea setDisconnected={setDisconnected} setConnected={setConnected}
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
