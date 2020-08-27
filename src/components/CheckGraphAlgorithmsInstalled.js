import React, {useState} from 'react'
import {Dimmer, Image, Loader} from "semantic-ui-react"

import {checkGraphAlgorithmsInstalled} from "../services/installation"


const CheckGraphAlgorithmsInstalled = (props) => {
  const [algorithmsInstalled, setAlgorithmsInstalled] = useState(false)

  checkGraphAlgorithmsInstalled().then(result => {
    setAlgorithmsInstalled(result)
  });


  if (algorithmsInstalled) {
    return props.children;
  } else {
    return <Dimmer active>

          <h1 className="loading">Graph Data Science Library Missing</h1>

        <div align="center" style={{margin: "10px"}}>
          <Image src='images/new-gds-plugin.png' />
        </div>

        <div align="center" className="loading-message">
          <p>
            This application relies on the Graph Data Science Library.
            <br/>You can install it via the 'Plugins' tab of your database.
          </p>
        </div>

    </Dimmer>
  }
}

export default CheckGraphAlgorithmsInstalled