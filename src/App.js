import React, { Component } from 'react'
import { Sidebar, Menu, Segment, Icon, Image, Header } from "semantic-ui-react"

import './App.css'

import AlgorithmsGroupMenu from "./components/AlgorithmGroupsMenu"
import { selectAlgorithm } from "./ducks/algorithms"
import { connect } from "react-redux"
import { getAlgorithms } from "./components/algorithmsLibrary"
import MainContent from './components/MainContent'

class App extends Component {
  state = {
    status: 'groups',
    content: 'centralities'
  }

  handleMenuClick (content) {
    this.setState({content})
  }

  render() {
    const {content} = this.state
    const { activeGroup, activeAlgorithm, selectAlgorithm } = this.props

    return (
      <Sidebar.Pushable as={Segment}>
        <Sidebar
          as={Menu}
          animation='push'
          direction='left'
          icon='labeled'
          inverted
          vertical
          visible={true}
          width='thin'
        >
          <AlgorithmsGroupMenu/>
        </Sidebar>

        <Sidebar.Pusher>
          <Segment basic inverted vertical={false} style={{ height: '5em', display: 'flex', width:'90%', justifyContent: 'space-between' }}>
            <Menu inverted>
              {getAlgorithms(activeGroup).map(algorithm =>
                <Menu.Item key={algorithm} as='a' active={activeAlgorithm === algorithm} onClick={() => selectAlgorithm(algorithm)}>
                  {algorithm}
                </Menu.Item>)}
            </Menu>
            <Header as='h1' inverted color='grey' style={{marginTop: '0'}}>
              NEuler
            </Header>
          </Segment>

          <MainContent />

        </Sidebar.Pusher>
      </Sidebar.Pushable>
    )
  }
}

const mapStateToProps = state => ({
  activeGroup: state.algorithms.group,
  activeAlgorithm: state.algorithms.algorithm
})

const mapDispatchToProps = dispatch => ({
  selectAlgorithm: algorithm => dispatch(selectAlgorithm(algorithm))
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
