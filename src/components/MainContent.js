import React, {Component} from 'react'
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
        <div style={{width: '100%'}}>
          <AlgoResults limit={limit} onComplete={this.props.onComplete}  />
        </div>
      </div>
    )
  }
}

export default MainContent
