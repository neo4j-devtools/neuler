import {Button, Divider, Dropdown, Form, Loader, Message} from "semantic-ui-react";
import CheckGraphAlgorithmsInstalled from "../CheckGraphAlgorithmsInstalled";
import CheckAPOCInstalled from "../CheckAPOCInstalled";
import React from "react";
import {ALL_DONE, CHECKING_APOC_PLUGIN, CHECKING_GDS_PLUGIN, CONNECTING_TO_DATABASE, SELECT_DATABASE} from "./startup";
import {CONNECTING, DISCONNECTED, INITIAL} from "../../ducks/connection";
import {ConnectModal} from "../ConnectModal";
import {tryConnect} from "../../services/connections";
import {loadDatabases} from "../../services/metadata";
import {getNeo4jVersion, onActiveDatabase} from "../../services/stores/neoStore";
import {setActiveDatabase} from "../../ducks/metadata";
import {connect} from "react-redux";
import {Render} from "graph-app-kit/components/Render";


export const WebAppLoadingArea = ({connectionStatus, currentStep, setCurrentStep, setCurrentStepFailed, setConnected, setDisconnected, setCurrentStepInProgress, queryParameters}) => {
    const placeholder = <Loader size='massive'>Checking plugin is installed</Loader>

    const failedCurrentStep = () => {
        setCurrentStepFailed(true)
    }

    const gdsInstalled = () => {
        setCurrentStep(CHECKING_APOC_PLUGIN)
        setCurrentStepFailed(false)
    }

    const apocInstalled = () => {
        setCurrentStep(ALL_DONE)
        setCurrentStepFailed(false)
    }

    switch (currentStep) {
        case CONNECTING_TO_DATABASE:
            return <ConnectingToDatabase connectionStatus={connectionStatus} setCurrentStep={setCurrentStep} setCurrentStepFailed={setCurrentStepFailed}
                                         setCurrentStepInProgress={setCurrentStepInProgress}
                                         setConnected={setConnected} setDisconnected={setDisconnected}
                                         queryParameters={queryParameters}
            />
        case SELECT_DATABASE:
            return <SelectDatabase currentStep={currentStep} setCurrentStep={setCurrentStep} setCurrentStepFailed={setCurrentStepFailed} />
        case CHECKING_GDS_PLUGIN:
            return <CheckGraphAlgorithmsInstalled didNotFindPlugin={failedCurrentStep}
                                                  gdsInstalled={gdsInstalled}>
                {placeholder}
            </CheckGraphAlgorithmsInstalled>;
        case CHECKING_APOC_PLUGIN:
            return <CheckAPOCInstalled didNotFindPlugin={failedCurrentStep}
                                       apocInstalled={apocInstalled}>
                {placeholder}
            </CheckAPOCInstalled>;
        case ALL_DONE:
            return <div className="loading-container">
                <Message color="grey" attached header="Neuler ready to launch"
                         content="Connected to database and all dependencies found. Neuler will launch shortly"/>
            </div>
        default:
            return <Message>Unknown State</Message>;
    }
}

const SelectDatabaseForm =({setActiveDatabase, setCurrentStep, setCurrentStepFailed}) => {
    const [databases, setDatabases] = React.useState([])
    const [selectedDatabase, setSelectedDatabase] = React.useState(null)
    const [loadedDatabases, setLoadedDatabases] = React.useState(false)

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
            setCurrentStep(CHECKING_GDS_PLUGIN)
        }
    }


    return <div className="loading-container">
        <Message color="grey" attached={true} header="Select database"/>
        <Form error={!!errorMessage}  className='attached fluid segment' onSubmit={onSubmit}>
            {databaseOptions.length > 0 &&
            <React.Fragment>
                <Dropdown placeholder='Database' fluid search selection value={selectedDatabase}
                          style={{"width": "290px"}}
                          options={databaseOptions} onChange={(evt, data) => {
                    setErrorMessage(null)
                    setSelectedDatabase(data.value)
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
                <Button
                    positive
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

            {!loadedDatabases &&
            <Loader active inline='centered'>Loading</Loader>}
        </Form>

    </div>
}

const SelectDatabase = connect(() => ({}), dispatch => ({
    setActiveDatabase: database => dispatch(setActiveDatabase(database)),
}))(SelectDatabaseForm)

const ConnectingToDatabase = ({connectionStatus, setCurrentStep, setConnected, setDisconnected, setCurrentStepFailed, setCurrentStepInProgress, queryParameters}) => {
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
                            setCurrentStepInProgress(false)
                            setCurrentStep(SELECT_DATABASE)
                            setConnected(credentials)
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