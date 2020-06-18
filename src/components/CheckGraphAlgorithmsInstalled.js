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
      <Loader size='massive'>
        <div align="center">
          <p>This application relies on the Graph Data Science Library.
            <br/>You can install it via the 'Plugins' tab in the project view.</p>
        </div>
        <div align="center" style={{margin: "10px"}}>
          <Image src='images/gds-plugin.png' size='big'/>

        </div>
      </Loader>

    </Dimmer>
  }
}

export default CheckGraphAlgorithmsInstalled