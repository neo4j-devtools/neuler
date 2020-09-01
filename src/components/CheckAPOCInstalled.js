import React, {useState} from 'react'
import {Dimmer, Image} from "semantic-ui-react"

import {checkApocInstalled, checkGraphAlgorithmsInstalled} from "../services/installation"


const CheckGraphAlgorithmsInstalled = (props) => {
    const [algorithmsInstalled, setAlgorithmsInstalled] = useState(true)

    checkApocInstalled().then(result => {
        if (!result) {
            props.didNotFindPlugin();
        } else {
            props.apocInstalled();
        }

        setAlgorithmsInstalled(result)
    });

    if (algorithmsInstalled) {
        return props.children;
    } else {
        return <React.Fragment>

            <h1>APOC Library Missing</h1>

            <div align="center" style={{margin: "10px"}}>
                <Image src='images/apoc-plugin.png'/>
            </div>

            <div align="center" className="loading-message">
                <p>
                    This application relies on the APOC Library.
                    <br/>You can install it via the 'Plugins' tab of your database.
                </p>
            </div>

        </React.Fragment>
    }
}

export default CheckGraphAlgorithmsInstalled