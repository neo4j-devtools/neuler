import {Loader, Message} from "semantic-ui-react";
import CheckGraphAlgorithmsInstalled from "../CheckGraphAlgorithmsInstalled";
import CheckAPOCInstalled from "../CheckAPOCInstalled";
import React from "react";
import {ALL_DONE, CHECKING_APOC_PLUGIN, CHECKING_GDS_PLUGIN, CONNECTING_TO_DATABASE} from "./startup";

export const DesktopAppLoadingArea = ({
                                          connectionStatus, currentStep, setCurrentStep, setCurrentStepFailed,
                                          setConnected, setDisconnected,
                                          currentStepFailed
                                      }) => {
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
                                         setConnected={setConnected} setDisconnected={setDisconnected}
                                         currentStepFailed={currentStepFailed}
            />
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
                <Message color="grey" >
                    <Message.Header>
                        Neuler ready to launch
                    </Message.Header>
                    <Message.Content>
                        Connected to active graph and all dependencies found. Neuler will launch shortly
                    </Message.Content>
                </Message>
            </div>
        default:
            return <Message>Unknown State</Message>;
    }
}

const ConnectingToDatabase = ({currentStepFailed}) => {
    return <div style={{padding: "20px"}}>
        {currentStepFailed ? <Message color="red" attached header="Trying to connect">
            <Message.Header>
                Unable to connect to active graph
            </Message.Header>
            <Message.Content>
                 Check that you have a running database before reloading the Graph Data Science Playground.
            </Message.Content>
        </Message> :
            <Message color="grey" attached header="Trying to connect">
                <Message.Header>
                    Trying to connect to active graph
                </Message.Header>
                <Message.Content>
                    This should only take a few seconds. If it takes longer than that, check that you have a running database.
                </Message.Content>
            </Message>}
    </div>

}