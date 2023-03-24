import React, {useState} from 'react'
import {Form, Image, Loader, Message, Segment} from "semantic-ui-react"

import {
    checkApocInstalled,
    checkApocMetaProcedure,
    checkApocMetaProcedureAvailable,
    findApocProceduresCypher
} from "../services/installation"
import {sendMetrics} from "./metrics/sendMetrics";
import Clipboard from "react-clipboard.js";
import {publicPathTo} from "./AlgorithmGroupsMenu";


const CheckGraphAlgorithmsInstalled = (props) => {
    const [checkComplete, setCheckComplete] = useState(false)
    const [pluginInstalled, setPluginInstalled] = useState(false)
    const [metaAvailable, setMetaAvailable] = useState(false)
    const libraryName = "apoc";

    React.useEffect(() => {
        let isSubscribed = true
        checkApocInstalled().then(apocInstalled => {

            if (isSubscribed) {
                if (!apocInstalled) {
                    sendMetrics("neuler-connected", "missing-dependency", {library: libraryName})
                    props.didNotFindPlugin(libraryName);
                    setPluginInstalled(false)
                    setCheckComplete(true)
                } else {
                    setPluginInstalled(true)
                    checkApocMetaProcedureAvailable().then(apocMetaProcedureAvailable => {
                        if (isSubscribed) {
                            if (!apocMetaProcedureAvailable) {
                                sendMetrics("neuler-connected", "missing-dependency", {
                                    library: libraryName,
                                    description: "apoc.meta.nodeTypeProperties is unavailable"
                                })
                                props.didNotFindPlugin(libraryName);
                            } else {
                                props.apocInstalled();
                            }

                            setCheckComplete(true)
                            setMetaAvailable(apocMetaProcedureAvailable)
                        }
                    })
                }
            }
        });

        return () => isSubscribed = false
    }, [libraryName])

    if (!checkComplete) {
        return <div className="loading-container">
            <Message color="grey" attached={true} header="Checking APOC Library Installation"/>
            <Segment attached={true}>
                We are checking whether the library is installed by running the following queries:
                <pre>
                        {findApocProceduresCypher};
                    </pre>
                <pre>
                        {checkApocMetaProcedure};
                    </pre>
            </Segment>
        </div>
    }

    if (!pluginInstalled) {
        return <div className="loading-container">
            <Message color="grey" attached={true} header="APOC Library Missing"/>
            {props.desktop ? <MissingLibraryOnDesktop/> : <MissingLibraryOnWebapp/>}

            <Segment attached={true}>
                    We check whether the library is installed by running the following queries:
                    <pre>
                        {findApocProceduresCypher};
                    </pre>
                <pre>
                        {checkApocMetaProcedure};
                    </pre>
            </Segment>
        </div>
    }

    if(!metaAvailable) {
        return <div className="loading-container">
            <Message color="grey" attached={true} header="APOC Metadata Procedure Unavailable"/>
            <MetaUnavailable />
        </div>
    }

    return <div className="loading-container">
        <Message color="grey" attached={true} header="APOC Library Installed"/>
        <Message color="grey" attached={true}  align="center" className="loading-message" >
            <Message.Content>
                <p>
                    The APOC Library is installed on this Neo4j Server. Proceeding to the next step.
                </p>
            </Message.Content>
        </Message>
    </div>

}

const MissingLibraryOnDesktop = () => {
    return <React.Fragment>
        <Form className='attached fluid segment'>
            <div align="center" className='attached fluid segment'>
                <Image  src= {publicPathTo("images/apoc-plugin.png")}/>
            </div>
        </Form>

        <Message color="grey" attached={true}  align="center" className="loading-message" >
            <Message.Content>
                <p>
                    This application relies on the APOC Library.
                    <br/>You can install it via the 'Plugins' tab of your database.
                </p>
            </Message.Content>
        </Message>
    </React.Fragment>
}

const MissingLibraryOnWebapp = () => {
    return <React.Fragment>
        <Message color="grey" attached={true}  align="center" className="loading-message" >
            <Message.Content>
                <p>
                    This application relies on the APOC Library.
                    <br/>You can find installation instructions in the <a target="_blank" rel="noopener noreferrer" href="https://neo4j.com/docs/apoc/current/installation/">documentation</a>.
                </p>
            </Message.Content>
        </Message>
    </React.Fragment>
}

const MetaUnavailable = () => {
    const sandboxSetting = "dbms.security.procedures.unrestricted=jwt.security.*,gds.*,apoc.*"
    return <React.Fragment>
        <Message color="grey" attached={true}  align="center"  >
            <Message.Content>
                <p>
                    This application uses the <i>apoc.meta.schema</i> procedure, which is currently unavailable because it is sandboxed and has dependencies outside of the sandbox. Sandboxing is controlled by the <i>dbms.security.procedures.unrestricted setting</i>.
                </p>
                <p>You can add the following entry to your Neo4j configuration file to allow access:
                </p>
                <Message>
                    <pre>
                        {sandboxSetting}
                    </pre>
                    <Clipboard onSuccess={(event) => {
                        event.trigger.textContent = "Copied";
                        setTimeout(() => {
                            event.trigger.textContent = 'Copy';
                        }, 2000);
                    }}
                               button-className="code"
                               data-clipboard-text={sandboxSetting}>
                        Copy
                    </Clipboard>
                </Message>

            </Message.Content>
        </Message>
    </React.Fragment>
}

export default CheckGraphAlgorithmsInstalled
