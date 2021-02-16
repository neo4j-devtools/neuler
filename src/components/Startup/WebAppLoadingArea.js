import {Button, Divider, Dropdown, Form, Loader, Message} from "semantic-ui-react";
import CheckGraphAlgorithmsInstalled from "../CheckGraphAlgorithmsInstalled";
import CheckAPOCInstalled from "../CheckAPOCInstalled";
import React from "react";
import {
    ALL_DONE,
    CHECKING_APOC_PLUGIN,
    CHECKING_GDS_PLUGIN,
    CONNECTING_TO_DATABASE,
    refreshMetadata,
    SELECT_DATABASE,
    updateMetadata
} from "./startup";
import {CONNECTING, DISCONNECTED, INITIAL} from "../../ducks/connection";
import {ConnectModal} from "../ConnectModal";
import {tryConnect} from "../../services/connections";
import {loadDatabases, loadMetadata} from "../../services/metadata";
import {getActiveDatabase, getNeo4jVersion, onActiveDatabase} from "../../services/stores/neoStore";
import {
    addDatabase,
    initLabel,
    setActiveDatabase,
    setDatabases,
    setLabels,
    setNodePropertyKeys,
    setPropertyKeys,
    setRelationshipTypes,
    setVersions
} from "../../ducks/metadata";
import {connect} from "react-redux";
import {Render} from "graph-app-kit/components/Render";
import SelectedDatabase from "../Onboarding/SelectedDatabase";
import {selectAlgorithm, selectGroup} from "../../ducks/algorithms";
import {hasNodesAndRelationships} from "../SelectDatabase";


export const WebAppLoadingArea = ({connectionStatus, isNeo4jDesktop, currentStep, setCurrentStep, setCurrentStepFailed, setConnected, setDisconnected, setCurrentStepInProgress, queryParameters, prepareMetadata}) => {
    const placeholder = <Loader size='massive'>Checking plugin is installed</Loader>

    const failedCurrentStep = () => {
        setCurrentStepFailed(true)
    }

    const gdsInstalled = () => {
        setCurrentStep(CHECKING_APOC_PLUGIN)
        setCurrentStepFailed(false)
    }

    const apocInstalled = () => {
        setCurrentStep(SELECT_DATABASE)
        setCurrentStepFailed(false)
    }

    switch (currentStep) {
        case CONNECTING_TO_DATABASE:
            return <ConnectingToDatabase connectionStatus={connectionStatus} setCurrentStep={setCurrentStep} setCurrentStepFailed={setCurrentStepFailed}
                                         setCurrentStepInProgress={setCurrentStepInProgress}
                                         setConnected={setConnected} setDisconnected={setDisconnected}
                                         queryParameters={queryParameters}
                                         prepareMetadata={prepareMetadata}
            />
        case CHECKING_GDS_PLUGIN:
            return <CheckGraphAlgorithmsInstalled didNotFindPlugin={failedCurrentStep} desktop={isNeo4jDesktop}
                                                  gdsInstalled={gdsInstalled}>
                {placeholder}
            </CheckGraphAlgorithmsInstalled>;
        case CHECKING_APOC_PLUGIN:
            return <CheckAPOCInstalled didNotFindPlugin={failedCurrentStep} desktop={isNeo4jDesktop}
                                       apocInstalled={apocInstalled}>
                {placeholder}
            </CheckAPOCInstalled>;
        case SELECT_DATABASE:
            return <SelectDatabase currentStep={currentStep} setCurrentStep={setCurrentStep} setCurrentStepFailed={setCurrentStepFailed} />
        case ALL_DONE:
            return <div className="loading-container">
                <Message color="grey" attached header="Neuler ready to launch"
                         content="Connected to database and all dependencies found. Neuler will launch shortly"/>
            </div>
        default:
            return <Message>Unknown State</Message>;
    }
}

const SelectDatabaseForm =(props) => {
    const {setActiveDatabase, setCurrentStep, setCurrentStepFailed} = props

    const [databases, setDatabases] = React.useState([])
    const [selectedDatabase, setSelectedDatabase] = React.useState(null)
    const [loadedDatabases, setLoadedDatabases] = React.useState(false)
    const [activeDatabaseSelected, setActiveDatabaseSelected] = React.useState(false)

    const [errorMessage, setErrorMessage] = React.useState(null)
    const errorMessageTemplate = "No database selected. Pick a database to connect to from the dropdown above."

    React.useEffect(() => {
        loadDatabases(getNeo4jVersion()).then(databases => {
            setDatabases(databases)
            setLoadedDatabases(true)
            if(databases.length === 1) {
                setSelectedDatabase(databases[0].name)
            }
            if(databases.length > 1) {
                const defaultDatabase = databases.find(database => database.default)
                if(defaultDatabase) {
                    setSelectedDatabase(defaultDatabase.name)
                }
            }
        })
    }, [])

    React.useEffect(() => {
        const prepareMetadata = async () => {
            return await refreshMetadata(props, true, (versions) =>  {
                setActiveDatabaseSelected(true)
                props.selectGroup("Centralities", versions.gdsVersion)
                props.selectAlgorithm("Degree")
            });
        }

        prepareMetadata()
    }, [props.connectionInfo])

    const databaseOptions= databases.map(value => {
        return  {key: value.name, value: value.name, text: (value.name) + (value.default ? " (default)" : "")};
    })

    const onSubmit = () => {
        if(!selectedDatabase) {
            setErrorMessage(errorMessageTemplate)
            setCurrentStepFailed(true)
        } else {
            setActiveDatabase(selectedDatabase);
            onActiveDatabase(selectedDatabase);
            setCurrentStep(ALL_DONE)
        }
    }

    const onRefresh = (database) => {
        setActiveDatabaseSelected(false)
        loadMetadata(props.metadata.versions.neo4jVersion).then(metadata => {
            updateMetadata(props, metadata, database || selectedDatabase)
            setActiveDatabaseSelected(true)
        })
    }

    return <div className="loading-container">
        <Message color="grey" attached={true} header="Select database"/>
        <Form error={!!errorMessage}  className='attached fluid segment' onSubmit={onSubmit}>
            {databaseOptions.length > 0 &&
            <React.Fragment>
                <Dropdown placeholder='Database' fluid search selection value={selectedDatabase}
                          style={{"width": "290px"}}
                          options={databaseOptions} onChange={(evt, data) => {
                    if (data.value !== getActiveDatabase()) {
                        setErrorMessage(null)
                        setSelectedDatabase(data.value)
                        setActiveDatabase(data.value);
                        onActiveDatabase(data.value);
                        onRefresh(data.value)
                    }
                }}/>
                <Render if={errorMessage}>
                    <Message error>
                        <Message.Header>
                            No database selected
                        </Message.Header>
                        <Message.Content>
                            {errorMessage}
                        </Message.Content>
                    </Message>
                </Render>
                <Divider/>

                {activeDatabaseSelected ?
                    (hasNodesAndRelationships(props.metadata)) ?
                        <div className="startup-selectDatabase">
                            <SelectedDatabase onRefresh={() => onRefresh()}/>
                        </div> :
                        <Message color='purple'>
                            <Message.Header>
                                Missing nodes or relationships
                            </Message.Header>
                            <Message.Content>
                                <div>
                                    <p>
                                        This database does not contain nodes or relationships.
                                    </p>
                                    <p>
                                        You can import sample datasets once you launch the application.
                                    </p>

                                </div>
                            </Message.Content>
                        </Message>

                    : <Message>
                        <Message.Header>Refreshing</Message.Header>
                        <Message.Content>
                            <Loader active inline style={{padding: "5px 0"}}/>
                        </Message.Content>
                    </Message>}

                <Button
                    positive
                    disabled={!activeDatabaseSelected}
                    icon='right arrow'
                    labelPosition='right'
                    content='Select database'
                    onClick={onSubmit}

                />
            </React.Fragment>
            }

            {loadedDatabases && databaseOptions.length === 0 &&
            <Message>
                    <Message.Header>
                        No databases available
                    </Message.Header>
                    <Message.Content>
                        The selected user does not have permissions to access any databases on this server
                    </Message.Content>
                </Message>}

            {!loadedDatabases && <Loader active inline='centered'>Loading</Loader>}
        </Form>

    </div>
}

const SelectDatabase = connect(state => ({
    metadata: state.metadata,
    labels: state.metadata.allLabels,
}), dispatch => ({
    selectGroup: (group, gdsVersion) => dispatch(selectGroup(group, gdsVersion)),
    selectAlgorithm: algorithm => dispatch(selectAlgorithm(algorithm)),
    setActiveDatabase: database => dispatch(setActiveDatabase(database)),
    setDatabases: databases => dispatch(setDatabases(databases)),
    setLabels: labels => dispatch(setLabels(labels)),
    setGds: version => dispatch(setVersions(version)),
    setRelationshipTypes: relationshipTypes => dispatch(setRelationshipTypes(relationshipTypes)),
    setPropertyKeys: propertyKeys => dispatch(setPropertyKeys(propertyKeys)),
    setNodePropertyKeys: propertyKeys => dispatch(setNodePropertyKeys(propertyKeys)),
    addDatabase: database => dispatch(addDatabase(database)),
    initLabel: (database, label, color, propertyKeys) => dispatch(initLabel(database, label, color, propertyKeys))
}))(SelectDatabaseForm)

const ConnectingToDatabaseForm = ({connectionStatus, setCurrentStep, setConnected, setDisconnected, setCurrentStepFailed, setCurrentStepInProgress, queryParameters, setActiveDatabase, prepareMetadata}) => {
    const errorMsgTemplate = "Could not get a connection! Check that you entered the correct credentials and that the database is running."
    const [errorMessage, setErrorMessage] = React.useState(null)
    const [extraErrorMessage, setExtraErrorMessage] = React.useState(null)

    const tryingToConnect = <div className="loading-container">
        <Message color="grey" attached header="Trying to connect"
                 content="Trying to connect to active database. This should only take a few seconds. If it takes longer than that, check that you have a running database."/>
    </div>

    switch (connectionStatus) {
        case INITIAL:
        case DISCONNECTED:
            return <ConnectModal
                key="modal"
                errorMsg={errorMessage}
                extraErrorMessage={extraErrorMessage}
                setErrorMessage={setErrorMessage}
                setExtraErrorMessage={setExtraErrorMessage}
                clearErrorMessages={() => {
                    setErrorMessage(null)
                    setExtraErrorMessage(null)
                }}
                queryParameters={queryParameters}
                onSubmit={(boltUri, username, password) => {
                    setCurrentStepInProgress(true)
                    setErrorMessage(null)
                    setExtraErrorMessage(null)
                    const credentials = {host: boltUri, username, password}
                    tryConnect(credentials)
                        .then(() => {
                            setConnected(credentials)
                            return loadDatabases(getNeo4jVersion());
                        }).then(databases => {
                        if (databases.length === 0) {
                            setCurrentStepFailed(true)
                        } else {
                            if (databases.length === 1) {
                                onActiveDatabase(databases[0].name)
                                setActiveDatabase(databases[0].name)
                            } else {
                                const defaultDatabase = databases.find(database => database.default)
                                if (defaultDatabase) {
                                    onActiveDatabase(defaultDatabase.name)
                                    setActiveDatabase(defaultDatabase.name)
                                } else {
                                    const db = databases[Math.floor(Math.random() * databases.length)];
                                    onActiveDatabase(db)
                                    setActiveDatabase(db)
                                }
                            }
                            setCurrentStep(CHECKING_GDS_PLUGIN)
                            setCurrentStepFailed(false)
                        }
                    })
                        .catch((error) => {
                            setCurrentStepInProgress(false)
                            setCurrentStepFailed(true)
                            setDisconnected()
                            setErrorMessage(errorMsgTemplate)
                            setExtraErrorMessage(error.message)
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

const ConnectingToDatabase = connect(() => ({}), dispatch => ({
    setActiveDatabase: database => dispatch(setActiveDatabase(database)),
}))(ConnectingToDatabaseForm)
