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
import {addDatabase, communityNodeLimit, initLabel, limit} from "../../ducks/settings";
import {WebAppLoadingArea} from "./WebAppLoadingArea";
import {LoadingIcon, UserInputLoadingIcon} from "./LoadingIcon";
import {
    ALL_DONE,
    CHECKING_APOC_PLUGIN,
    CHECKING_GDS_PLUGIN,
    CONNECTING_TO_DATABASE,
    refreshMetadata,
    SELECT_DATABASE,
    setLimitDefaults,
    webAppSteps
} from "./startup";
import * as qs from "qs";
import {FeedbackForm} from "../Feedback/FeedbackForm";
import constants from "../../constants";
import {Redirect} from "react-router-dom";

const NewApp = (props) => {
    const [queryParameters, setQueryParameters] = React.useState({})
    React.useEffect(() => {
        props.selectGroup("Centralities")
        props.selectAlgorithm("Degree")
        setQueryParameters(qs.parse(props.location.search, { ignoreQueryPrefix: true }))
        props.history.push(props.location.pathname)
    }, [])

    const [currentStep, setCurrentStep] = React.useState(CONNECTING_TO_DATABASE)
    const [currentStepFailed, setCurrentStepFailed] = React.useState(false)
    const [currentStepInProgress, setCurrentStepInProgress] = React.useState(false)
    const [showNeuler, setShowNeuler] = React.useState(false)
    const [metadataLoaded, setMetadataLoaded] = React.useState(false)
    const {setConnected, setDisconnected, connectionInfo} = props

    const [serverInfo, setServerInfo] = React.useState(null)

    React.useEffect(() => {
        if (props.connectionInfo.status === CONNECTED) {
            setCurrentStep(SELECT_DATABASE)
            setCurrentStepFailed(false)
            setServerInfo(props.connectionInfo.credentials.username + "@" + props.connectionInfo.credentials.host)
        }

    }, [props.connectionInfo.status])

    React.useEffect(() => {
        if (currentStep === ALL_DONE) {
            refreshMetadata(props, true, () => setMetadataLoaded(true))
            setLimitDefaults(props)
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

    return <Container fluid style={{display: 'flex', height: '100%', overflowY: 'auto'}}>
        <div style={{width: '100%'}}>
            <Segment basic inverted vertical={false}>
                <div style={{textAlign: "center"}}>
                    <h1 className="loading">Launching NEuler - The Graph Data Science Playground</h1>
                </div>
                <Divider/>
                <div className="loading-wrapper">
                    <div className="loading">
                        <UserInputLoadingIcon step={CONNECTING_TO_DATABASE} currentStep={currentStep}
                                              steps={webAppSteps} currentStepInProgress={currentStepInProgress}
                                              setCurrentStepInProgress={setCurrentStepInProgress}
                                              currentStepFailed={currentStepFailed}/>
                        <p>Connecting to server

                        </p>
                    </div>
                    <div className="loading">
                        <UserInputLoadingIcon step={SELECT_DATABASE} currentStep={currentStep}
                                              steps={webAppSteps}
                                              currentStepFailed={currentStepFailed}/>
                        <p>Select database</p>
                    </div>
                    <div className="loading">
                        <LoadingIcon step={CHECKING_GDS_PLUGIN} currentStep={currentStep}
                                     steps={webAppSteps}
                                     currentStepFailed={currentStepFailed}/>
                        <p>Checking GDS plugin</p>
                    </div>
                    <div className="loading">
                        <LoadingIcon step={CHECKING_APOC_PLUGIN} currentStep={currentStep}
                                     steps={webAppSteps}
                                     currentStepFailed={currentStepFailed}/>
                        <p>Checking APOC plugin</p>
                    </div>
                </div>

                <div style={{...smallStyle, paddingBottom: "10px", textAlign: "center", color: "#ccc"}}>
                    <div style={smallStyle}>
                        {serverInfo ? <React.Fragment>Connected to: {serverInfo}</React.Fragment> : null}
                    </div>
                </div>

                <Divider/>

                <div>
                    <WebAppLoadingArea setDisconnected={setDisconnected} setConnected={setConnected}
                                       connectionStatus={connectionInfo.status} currentStep={currentStep}
                                       setCurrentStep={setCurrentStep}
                                       setCurrentStepFailed={setCurrentStepFailed}
                                       setCurrentStepInProgress={setCurrentStepInProgress}
                                       queryParameters={queryParameters}
                    />
                </div>
                <FeedbackForm page={constants.version + "/WebApp-Startup" } />
            </Segment>
        </div>
    </Container>
}

const mapStateToProps = state => ({
    activeGroup: state.algorithms.group,
    activeAlgorithm: state.algorithms.algorithm,
    connectionInfo: state.connections,
    metadata: state.metadata,
    limit: state.settings.limit,
    communityNodeLimit: state.settings.communityNodeLimit,
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

    updateLimit: value => dispatch(limit(value)),
    updateCommunityNodeLimit: value => dispatch(communityNodeLimit(value)),

    selectGroup: algorithm => dispatch(selectGroup(algorithm)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NewApp)
