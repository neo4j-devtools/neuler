import React, { Component } from 'react'
import { Container, Menu, Segment, Dimmer, Loader, Header } from "semantic-ui-react"

import AlgorithmsGroupMenu from "./AlgorithmGroupsMenu"
import { getAlgorithms } from "./algorithmsLibrary"
import MainContent from './MainContent'
import { connect } from "react-redux"
import { Form, Input, Dropdown } from "semantic-ui-react"
import { limit } from "../ducks/settings"
import Dashboard from './Dashboard'

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
    const { activeGroup, activeAlgorithm, selectAlgorithm, limit } = this.props

    const mainContent = activeGroup === 'Dashboard' ? <Dashboard/> : <MainContent limit={limit} />

    return (
      <Container fluid style={{ display: 'flex' }}>
          <AlgorithmsGroupMenu>
            <Form>
            <Form.Field>
              <label style={{ 'width': '10em', 'color': 'white' }}>Rows to show</label>
              <input
                type='number'
                placeholder="Rows"
                min={1}
                max={1000}
                step={1}
                value={limit}
                onChange={evt => this.props.updateLimit(evt.target.value)}
                style={{ 'width': '10em' }}
              />
            </Form.Field>
          </Form>
        </AlgorithmsGroupMenu>
        <div style={{width: '100%'}}>
          <Segment basic inverted vertical={false}
                   style={{ height: '5em', display: 'flex', justifyContent: 'space-between' }}>
            <Menu inverted>
              {activeGroup === 'Dashboard' ? null : getAlgorithms(activeGroup).map(algorithm =>
                <Menu.Item key={algorithm} as='a' active={activeAlgorithm === algorithm} onClick={() => selectAlgorithm(algorithm)}>
                  {algorithm}
                </Menu.Item>)}
            </Menu>
            <Header as='h1' inverted color='grey' style={{marginTop: '0'}}>
              NEuler
            </Header>
          </Segment>

         {mainContent}
        </div>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  limit: state.settings.limit
})

const mapDispatchToProps = dispatch => ({
  updateLimit: value => dispatch(limit(value))
})

export default connect(mapStateToProps, mapDispatchToProps)(NEuler)
