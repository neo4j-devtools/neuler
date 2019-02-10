import React, { Component } from 'react'
import { Container, Menu, Segment, Dimmer, Loader, Header } from "semantic-ui-react"

import AlgorithmsGroupMenu from "./AlgorithmGroupsMenu"
import { getAlgorithms } from "./algorithmsLibrary"
import MainContent from './MainContent'
import { connect } from "react-redux"


class NEuler extends Component {
  constructor(props, context) {
    super(props, context);
  }

  state = {
    status: 'groups',
    content: 'centralities'
  }

  handleMenuClick (content) {
    this.setState({content})
  }

  render() {
    const { activeGroup, activeAlgorithm, selectAlgorithm } = this.props

    return (
      <Container fluid style={{ display: 'flex' }}>
          <AlgorithmsGroupMenu/>
        <div style={{width: '100%'}}>
          <Segment basic inverted vertical={false}
                   style={{ height: '5em', display: 'flex', justifyContent: 'space-between' }}>
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
        </div>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  limit: state.settings.limit
})

const mapDispatchToProps = dispatch => ({
  limit: limit => dispatch(limit(limit))
})

export default connect(mapStateToProps, mapDispatchToProps)(NEuler)
