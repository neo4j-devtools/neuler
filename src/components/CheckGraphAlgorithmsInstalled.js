import React, { Component } from 'react'
import { Container, Menu, Segment, Dimmer, Loader, Header } from "semantic-ui-react"

import {checkGraphAlgorithmsInstalled} from "../services/installation"

class CheckGraphAlgorithmsInstalled extends Component {
  constructor(props) {
    super(props)
    this.state = {
      algorithmsInstalled: false
    }

    checkGraphAlgorithmsInstalled().then(result => {
      this.setState({
        algorithmsInstalled: result
      })
    });
  }

  render() {
     if(this.state.algorithmsInstalled) {
      return this.props.children;
     } else {
       return <Dimmer active>
         <Loader size='massive'>This application relies on the Graph Data Science Library. You can install it via the 'Plugins' tab in the project view.</Loader>
       </Dimmer>
     }
  }
}

export default CheckGraphAlgorithmsInstalled
