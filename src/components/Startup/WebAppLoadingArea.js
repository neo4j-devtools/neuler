import {Loader, Message} from "semantic-ui-react";
import CheckGraphAlgorithmsInstalled from "../CheckGraphAlgorithmsInstalled";
import CheckAPOCInstalled from "../CheckAPOCInstalled";
import React from "react";
import {ALL_DONE, CHECKING_APOC_PLUGIN, CHECKING_GDS_PLUGIN, CONNECTING_TO_DATABASE} from "./startup";
import {CONNECTING, DISCONNECTED, INITIAL} from "../../ducks/connection";
import {ConnectModal} from "../ConnectModal";
import {tryConnect} from "../../services/connections";


export const WebAppLoadingArea = ({connectionStatus, currentStep, setCurrentStep, setCurrentStepFailed, setConnected, setDisconnected}) => {
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
            return <ConnectingToDatabase connectionStatus={connectionStatus} setCurrentStep={setCurrentStep}
                                         setConnected={setConnected} setDisconnected={setDisconnected}/>
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
            return <div style={{padding: "20px"}}>
                <Message color="grey" attached header="Neuler ready to launch"
                         content="Connected to active database and all dependencies found. Neuler will launch shortly"/>
            </div>
        default:
            return <Message>Unknown State</Message>;
    }
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