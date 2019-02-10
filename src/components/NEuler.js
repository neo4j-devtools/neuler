import React, { Component } from 'react'
import { Container, Menu, Segment, Dimmer, Loader, Header } from "semantic-ui-react"

import AlgorithmsGroupMenu from "./AlgorithmGroupsMenu"
import { getAlgorithms } from "./algorithmsLibrary"
import MainContent from './MainContent'
import { connect } from "react-redux"
import { Form, Input, Dropdown } from "semantic-ui-react"
import { limit } from "../ducks/settings"

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

    return (
      <Container fluid style={{ display: 'flex' }}>
          <AlgorithmsGroupMenu>
            <Form>
            <Form.Field inline>
              <label style={{ 'width': '10em' }}>Rows to show</label>
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
  updateLimit: value => dispatch(limit(value))
})

export default connect(mapStateToProps, mapDispatchToProps)(NEuler)
