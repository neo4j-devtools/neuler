import React, {Component} from 'react'
import {Container, Divider, Icon, Loader, Message, Segment} from "semantic-ui-react"

import './App.css'
import CheckGraphAlgorithmsInstalled from "./components/CheckGraphAlgorithmsInstalled"
import CheckAPOCInstalled from "./components/CheckAPOCInstalled"
import NEuler from "./components/NEuler"
import {selectAlgorithm} from "./ducks/algorithms"
import {connect} from "react-redux"

import {ConnectModal} from './components/ConnectModal';

import {onNeo4jVersion} from "./services/stores/neoStore"
import {loadMetadata, loadVersions} from "./services/metadata"
import {
  setDatabases,
  setLabels,
  setNodePropertyKeys,
  setPropertyKeys,
  setRelationshipTypes,
  setVersions
} from "./ducks/metadata"
import {CONNECTED, CONNECTING, DISCONNECTED, INITIAL, setConnected, setDisconnected} from "./ducks/connection"
import {initializeConnection, initializeWebConnection, tryConnect} from "./services/connections"
import {sendMetrics} from "./components/metrics/sendMetrics";
import {checkApocInstalled, checkGraphAlgorithmsInstalled} from "./services/installation";
import {addDatabase, initLabel} from "./ducks/settings";
import {selectCaption, selectRandomColor} from "./components/NodeLabel";


const ALL_DONE = "all-done";
const CONNECTING_TO_DATABASE = "database";
const CHECKING_GDS_PLUGIN = "gds";
const CHECKING_APOC_PLUGIN = "apoc";

const onConnected = (props) => {
    console.log("onConnected", props)
    checkGraphAlgorithmsInstalled().then((gdsInstalled) => {
        checkApocInstalled().then(apocInstalled => {
            if (apocInstalled && gdsInstalled) {
                loadVersions().then(versions => {
                    sendMetrics("neuler-connected", true, versions)

                    props.setGds(versions)
                    onNeo4jVersion(versions.neo4jVersion)
                    loadMetadata(versions.neo4jVersion).then(metadata => {
                        props.setLabels(metadata.labels)
                        props.setRelationshipTypes(metadata.relationships)
                        props.setPropertyKeys(metadata.propertyKeys)
                        props.setNodePropertyKeys(metadata.nodePropertyKeys)
                        props.setDatabases(metadata.databases)

                        metadata.databases.forEach(database => {
                            props.addDatabase(database.name)
                        })

                        metadata.labels.forEach(label => {
                            props.initLabel(props.metadata.activeDatabase, label.label, selectRandomColor(), selectCaption(metadata.nodePropertyKeys[label.label]))
                        })

                    })
                });
            } else {
                sendMetrics("neuler", "neuler-connected-incomplete", {gdsInstalled, apocInstalled})
            }
        })
    });
}

const steps = [
    CONNECTING_TO_DATABASE, CHECKING_GDS_PLUGIN, CHECKING_APOC_PLUGIN, ALL_DONE
]

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
        console.log("props.connectionInfo", props.connectionInfo)
        if (props.connectionInfo.status === CONNECTED) {
            setCurrentStep(CHECKING_GDS_PLUGIN)
            setCurrentStepFailed(false)
            onConnected(props)
        }

    }, [props.connectionInfo.status])


    const renderExtra = (connectionStatus) => {
        const placeholder = <Loader size='massive'>Checking plugin is installed</Loader>
        switch (currentStep) {
            case CONNECTING_TO_DATABASE:
                return <ConnectingToDatabase connectionStatus={connectionStatus} setCurrentStep={setCurrentStep} setConnected={setConnected} setDisconnected={setDisconnected} />
            case CHECKING_GDS_PLUGIN:
                return <CheckGraphAlgorithmsInstalled didNotFindPlugin={failedCurrentStep} gdsInstalled={gdsInstalled}>{placeholder}</CheckGraphAlgorithmsInstalled>;
            case CHECKING_APOC_PLUGIN:
                return <CheckAPOCInstalled didNotFindPlugin={failedCurrentStep} apocInstalled={apocInstalled}>{placeholder}</CheckAPOCInstalled>;
            case ALL_DONE:
                return <div style={{padding: "20px"}}>
                    <Message color="grey" attached header="Neuler ready to launch"
                             content="Connected to active database and all dependencies found. Neuler will launch shortly"/>
                </div>
            default:
                return <Message>Unknown State</Message>;
        }
    }

    const failedCurrentStep =(library) => {
        setCurrentStepFailed(true)
    }

    const gdsInstalled = () => {
        setCurrentStep(CHECKING_APOC_PLUGIN)
        setCurrentStepFailed(false)

    }

    const apocInstalled =() => {
        setCurrentStep(ALL_DONE)
        setCurrentStepFailed(false)
    }

    if(currentStep === ALL_DONE) {
        if(showNeuler) {
            return <NEuler key="app" {...props} />;
        } else {
            setTimeout(function () {
                setShowNeuler(true)
            }, 1500);
        }
    }

    const extra = renderExtra(connectionInfo.status)

    return <Container fluid style={{display: 'flex'}}>
        <div style={{width: '100%'}}>
            <Segment basic inverted vertical={false} style={{height: '100vh'}}>
                <div style={{textAlign: "center"}}>
                    <h1 className="loading">Launching NEuler - The Graph Data Science Playground</h1>
                </div>
                <Divider/>
                <div style={{textAlign: "center", paddingTop: "10px", display: "flex", justifyContent: "center"}}>
                    <div className="loading">
                        <LoadingIcon step={CONNECTING_TO_DATABASE} currentStep={currentStep} currentStepFailed={currentStepFailed} />
                        <p>Connecting to database</p>
                    </div>
                    <div className="loading">
                        <LoadingIcon step={CHECKING_GDS_PLUGIN} currentStep={currentStep} currentStepFailed={currentStepFailed} />
                        <p>Checking GDS plugin</p>
                    </div>
                    <div className="loading">
                        <LoadingIcon step={CHECKING_APOC_PLUGIN} currentStep={currentStep} currentStepFailed={currentStepFailed} />
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

const ConnectingToDatabase = ({connectionStatus, setCurrentStep, setConnected, setDisconnected}) => {
    const errorMsgTemplate = "Could not get a connection! Check that you entered the correct credentials and that the database is running."
    const [errorMessage, setErrorMessage] = React.useState(null)

    const tryingToConnect = <div style={{padding: "20px"}}>
        <Message color="grey" attached header="Trying to connect"
                 content="Trying to connect to active database. This should only take a few seconds. If it takes longer than that, check that you have a running database."/>
    </div>

    switch (connectionStatus) {
        case INITIAL:
        case DISCONNECTED:
            return <ConnectModal
                key="modal"
                errorMsg={errorMessage}
                onSubmit={(username, password) => {
                    setErrorMessage(null)
                    const credentials = {username, password}
                    tryConnect(credentials)
                        .then(() => {
                            setCurrentStep(CHECKING_GDS_PLUGIN)
                            setConnected(credentials)
                        })
                        .catch(() => {
                            setDisconnected()
                            setErrorMessage(errorMsgTemplate)
                        })
                }}
                show={true}
            />

        case CONNECTING:
            return tryingToConnect
        default:
            return tryingToConnect
    }

}

const LoadingIcon = ({step, currentStep, currentStepFailed}) => {
    const currentIndex = steps.indexOf(currentStep)
    const stepIndex = steps.indexOf(step)

    if(step === currentStep) {
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
