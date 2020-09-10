import {Loader, Message} from "semantic-ui-react";
import {setConnected, setDisconnected} from "../../ducks/connection";
import CheckGraphAlgorithmsInstalled from "../CheckGraphAlgorithmsInstalled";
import CheckAPOCInstalled from "../CheckAPOCInstalled";
import React from "react";
import {ALL_DONE, CHECKING_APOC_PLUGIN, CHECKING_GDS_PLUGIN, CONNECTING_TO_DATABASE} from "./startup";
import {ConnectingToDatabase} from "./ConnectingToDatabase";

export const LoadingArea = ({connectionStatus, currentStep, setCurrentStep, setCurrentStepFailed, setConnected, setDisconnected}) => {
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
                                                  gdsInstalled={gdsInstalled}>{placeholder}</CheckGraphAlgorithmsInstalled>;
        case CHECKING_APOC_PLUGIN:
            return <CheckAPOCInstalled didNotFindPlugin={failedCurrentStep}
                                       apocInstalled={apocInstalled}>{placeholder}</CheckAPOCInstalled>;
        case ALL_DONE:
            return <div style={{padding: "20px"}}>
                <Message color="grey" attached header="Neuler ready to launch"
                         content="Connected to active database and all dependencies found. Neuler will launch shortly"/>
            </div>
        default:
            return <Message>Unknown State</Message>;
    }
}