import React from "react";
import {Message} from "semantic-ui-react";
import {CONNECTING, DISCONNECTED, INITIAL} from "../../ducks/connection";
import {ConnectModal} from "../ConnectModal";
import {tryConnect} from "../../services/connections";
import {CHECKING_GDS_PLUGIN} from "./startup";

export const ConnectingToDatabase = ({connectionStatus, setCurrentStep, setConnected, setDisconnected}) => {
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