import React, {useState} from 'react'
import {Form, Image, Message} from "semantic-ui-react"

import {checkApocInstalled} from "../services/installation"
import {sendMetrics} from "./metrics/sendMetrics";


const CheckGraphAlgorithmsInstalled = (props) => {
    const [algorithmsInstalled, setAlgorithmsInstalled] = useState(true)
    const libraryName = "apoc";

    React.useEffect(() => {
        checkApocInstalled().then(result => {
            if (!result) {
                sendMetrics("neuler-connected", "missing-dependency", {library: libraryName})
                props.didNotFindPlugin(libraryName);
            } else {
                props.apocInstalled();
            }

            setAlgorithmsInstalled(result)
        });
    }, [])



    if (algorithmsInstalled) {
        return props.children;
    } else {
        return <div className="loading-container">
            <Message color="grey" attached={true} header="APOC Library Missing"/>
            {props.desktop ? <MissingLibraryOnDesktop /> : <MissingLibraryOnWebapp />}

        </div>

    }
}

const MissingLibraryOnDesktop = () => {
    return <React.Fragment>
        <Form className='attached fluid segment'>
            <div align="center" className='attached fluid segment'>
                <Image src='images/apoc-plugin.png'/>
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
                    <br/>You can find installation instructions at <a target="_blank" rel="noopener noreferrer" href="https://neo4j.com/labs/apoc/4.1/installation/">neo4j.com/labs/apoc/4.1/installation</a>
                </p>
            </Message.Content>
        </Message>
    </React.Fragment>
}

export default CheckGraphAlgorithmsInstalled