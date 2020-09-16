import React, {useState} from 'react'
import {Form, Image, Message} from "semantic-ui-react"

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
        return <div className="loading-container">
            <Message color="grey" attached={true} header="Graph Data Science Library Missing"/>
            <Form className='attached fluid segment' >
                <div align="center" className='attached fluid segment' >
                    <Image src='images/gds-plugin.png'/>
                </div>

                <div align="center" className="loading-message">
                    <p>
                        This application relies on the Graph Data Science Library.
                        <br/>You can install it via the 'Plugins' tab of your database.
                    </p>
                </div>
            </Form>

        </div>
    }
}

export default CheckGraphAlgorithmsInstalled