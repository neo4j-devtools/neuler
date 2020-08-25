import React, {Component} from 'react'
import AlgorithmForm from './AlgorithmForm'
import AlgoResults from './AlgoResults'

class MainContent extends Component {
  state = {
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    console.log("ERROORRRRRRRRR", error, info)
  }

  render() {
    const {limit} = this.props

    const mainStyle = {
      display: 'flex'
    }

    return   (
      <div style={mainStyle}>
        <div>
          <AlgorithmForm limit={limit} />
        </div>
        <div style={{width: '100%'}}>
          <AlgoResults onComplete={this.props.onComplete}  />
        </div>
      </div>
    )
      /*
      <Grid columns={2} style={{height: '90%'}}>
        <Grid.Row style={{margin: '0', padding: '0'}}>
          <Grid.Column width={4} style={{minWidth: '25em'}}>

          </Grid.Column>
          <Grid.Column width={12} style={{paddingLeft: '0'}}>

          </Grid.Column>
        </Grid.Row>
      </Grid>)*/
  }
}

export default MainContent
