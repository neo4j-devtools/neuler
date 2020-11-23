import React, {useState} from 'react'
import {Form, Image, Message, Segment} from "semantic-ui-react"

import {checkGraphAlgorithmsInstalled, findGraphAlgosProceduresCypher} from "../services/installation"
import {sendMetrics} from "./metrics/sendMetrics";
import {publicPathTo} from "./AlgorithmGroupsMenu";


const CheckGraphAlgorithmsInstalled = (props) => {
    const libraryName = "gds";
    const [checkComplete, setCheckComplete] = useState(false)
    const [algorithmsInstalled, setAlgorithmsInstalled] = useState(true)

    React.useEffect(() => {
        let isSubscribed = true
        checkGraphAlgorithmsInstalled().then(result => {
            if(isSubscribed) {
                if (!result) {
                    sendMetrics("neuler-connected", "missing-dependency", {library: libraryName})
                    props.didNotFindPlugin(libraryName);
                    setCheckComplete(true)
                } else {
                    props.gdsInstalled();
                    setCheckComplete(true)
                }

                setAlgorithmsInstalled(result)
            }
        });

        return () => isSubscribed = false
    }, [libraryName])

    if (!checkComplete) {
        return <div className="loading-container">
            <Message color="grey" attached={true} header="Checking GDS Library Installation"/>
            <Segment attached={true}>
                We are checking whether the library is installed by running the following query:
                <pre>
                        {findGraphAlgosProceduresCypher};
                    </pre>
            </Segment>
        </div>
    }


    if (!algorithmsInstalled) {
        return <div className="loading-container">
            <Message color="grey" attached={true} header="Graph Data Science Library Missing"/>
            {props.desktop ? <MissingLibraryOnDesktop /> : <MissingLibraryOnWebapp />}

        </div>
    }

    return <div className="loading-container">
        <Message color="grey" attached={true} header="GDS Library Installed"/>
        <Message color="grey" attached={true}  align="center" className="loading-message" >
            <Message.Content>
                <p>
                    The GDS Library is installed on this Neo4j Server. Proceeding to the next step.
                </p>
            </Message.Content>
        </Message>
    </div>

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

        <Segment attached={true}>
            We check whether the library is installed by running the following query:
            <pre>
                        {findGraphAlgosProceduresCypher};
                    </pre>
        </Segment>
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
