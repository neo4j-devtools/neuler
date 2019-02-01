import React, { Component } from 'react'
import { Sidebar, Menu, Segment, Icon, Image, Header } from "semantic-ui-react"

import './App.css'
import CentralityAlgorithms from './components/Centralities/AlgoGroupView'
import CommunityAlgorithms from './components/Communities/AlgoGroupView'

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
          <Segment basic inverted vertical={false} style={{ height: '5em', display: 'flex', width:'90%', justifyContent: 'space-between' }}>
            <Menu inverted>
              <Menu.Item as='a'>
                <Icon name='connectdevelop'/>
                Page Rank
              </Menu.Item>
              <Menu.Item as='a'>
                <Icon name='clone'/>
                Article Rank
              </Menu.Item>
              <Menu.Item as='a'>
                <Icon name='clone'/>
                Betweenness Centrality
              </Menu.Item>
              <Menu.Item as='a'>
                <Icon name='clone'/>
                Approx. Betweenness Centrality
              </Menu.Item>
            </Menu>
            <Header as='h1' inverted color='grey' style={{marginTop: '0'}}>
              NEuler
            </Header>
          </Segment>

          {content == "centralities" ? <CentralityAlgorithms/> : <CommunityAlgorithms/>}

        </Sidebar.Pusher>
      </Sidebar.Pushable>
    )
  }
}

export default App
