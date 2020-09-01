import React, {useState} from 'react'
import {Dimmer, Image} from "semantic-ui-react"

import {checkGraphAlgorithmsInstalled} from "../services/installation"


const CheckGraphAlgorithmsInstalled = (props) => {
    const [algorithmsInstalled, setAlgorithmsInstalled] = useState(true)

    checkGraphAlgorithmsInstalled().then(result => {
        if (!result) {
            props.didNotFindPlugin("gds");
        } else {
            props.gdsInstalled();
        }

        setAlgorithmsInstalled(result)
    });

    if (algorithmsInstalled) {
        return props.children;
    } else {
        return <React.Fragment>

            <h1>Graph Data Science Library Missing</h1>

            <div align="center" style={{margin: "10px"}}>
                <Image src='images/gds-plugin.png'/>
            </div>

            <div align="center" className="loading-message">
                <p>
                    This application relies on the Graph Data Science Library.
                    <br/>You can install it via the 'Plugins' tab of your database.
                </p>
            </div>

        </React.Fragment>
    }
}

export default CheckGraphAlgorithmsInstalled