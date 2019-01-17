import React, { Component } from 'react'
import { Sidebar, Menu, Segment, Icon, Image, Header } from "semantic-ui-react"

import './App.css'
import MainContent from './components/AlgoGroupView'

class App extends Component {
  state = {
    content: 'centralities'
  }

  handleMenuClick (content) {
    this.setState({content})
  }

  render() {
    const {content} = this.state

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
          <Menu.Item active={content === 'centralities'} as='a' onClick={this.handleMenuClick.bind(this, 'centralities')}>
            <Icon name='sun' />
            Centralities
          </Menu.Item>
          <Menu.Item active={content === 'community'} as='a' onClick={this.handleMenuClick.bind(this, 'community')}>
            <Icon name='group' />
            Community Detection
          </Menu.Item>
          <Menu.Item as='a'>
            <Icon name='connectdevelop' />
            Path Finding
          </Menu.Item>
          <Menu.Item as='a'>
            <Icon name='clone' />
            Similarities
          </Menu.Item>
        </Sidebar>

        <Sidebar.Pusher>
          <Segment basic inverted vertical={false} style={{height: '5em'}}>
            <Header as='h1' inverted color='grey'>
              NEuler - Playground for Neo4j Graph Algorithms
            </Header>
          </Segment>
          <MainContent />
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    )
  }
}

export default App
