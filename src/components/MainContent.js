import { Grid } from "semantic-ui-react"
import React, { Component } from 'react'
import AlgorithmForm from './AlgorithmForm'
import AlgoResults from './AlgoResults'

class MainContent extends Component {

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    console.log("ERROORRRRRRRRR", error, info)
  }

  render() {
    const {limit} = this.props
    return   (<Grid columns={2} style={{height: '90%'}}>
        <Grid.Row style={{margin: '0', padding: '0'}}>
          <Grid.Column width={4} style={{minWidth: '25em'}}>
            <AlgorithmForm limit={limit} />
          </Grid.Column>
          <Grid.Column width={12} style={{paddingLeft: '0'}}>
            <AlgoResults/>
          </Grid.Column>
        </Grid.Row>
      </Grid>)

  }
}

export default MainContent
