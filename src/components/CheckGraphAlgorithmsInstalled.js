import React, {useState} from 'react'
import {Form, Image, Message} from "semantic-ui-react"

import {checkGraphAlgorithmsInstalled} from "../services/installation"
import {sendMetrics} from "./metrics/sendMetrics";
import {publicPathTo} from "./AlgorithmGroupsMenu";


const CheckGraphAlgorithmsInstalled = (props) => {
    const libraryName = "gds";
    const [algorithmsInstalled, setAlgorithmsInstalled] = useState(true)

    React.useEffect(() => {
        let isSubscribed = true
        checkGraphAlgorithmsInstalled().then(result => {
            if(isSubscribed) {
                if (!result) {
                    sendMetrics("neuler-connected", "missing-dependency", {library: libraryName})
                    props.didNotFindPlugin(libraryName);
                } else {
                    props.gdsInstalled();
                }

                setAlgorithmsInstalled(result)
            }
        });

        return () => isSubscribed = false
    }, [libraryName])

    if (algorithmsInstalled) {
        return props.children;
    } else {
        return <div className="loading-container">
            <Message color="grey" attached={true} header="Graph Data Science Library Missing"/>
            {props.desktop ? <MissingLibraryOnDesktop /> : <MissingLibraryOnWebapp />}

        </div>
    }
}

const MissingLibraryOnDesktop = () => {
    return <React.Fragment>
        <Form className='attached fluid segment'>
            <div align="center" className='attached fluid segment'>
                <Image src= {publicPathTo("images/gds-plugin.png")}  />
            </div>
        </Form>
        <Message color="grey" attached={true} align="center" className="loading-message">
            <Message.Content>
                <p>
                    This application relies on the Graph Data Science Library.
                    <br/>You can install it via the 'Plugins' tab of your database.
                </p>
            </Message.Content>
        </Message>
    </React.Fragment>
}

const MissingLibraryOnWebapp = () => {
    return <React.Fragment>
        <Message color="grey" attached={true} align="center" className="loading-message">
            <Message.Content>
                <p>
                    This application relies on the Graph Data Science Library.
                    <br/>You can find installation instructions at <a target="_blank" rel="noopener noreferrer" href="https://neo4j.com/docs/graph-data-science/current/installation/">neo4j.com/docs/graph-data-science/current/installation</a>
                </p>
            </Message.Content>
        </Message>
    </React.Fragment>
}

export default CheckGraphAlgorithmsInstalled
