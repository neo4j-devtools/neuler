
import React, {Component} from 'react'
import {Container, Header, Menu, Segment} from "semantic-ui-react"

import AlgorithmsGroupMenu from "./AlgorithmGroupsMenu"
import {getAlgorithms} from "./algorithmsLibrary"
import MainContent from './MainContent'
import Datasets from './Datasets'
import {connect} from "react-redux"
import {limit} from "../ducks/settings"
import {loadMetadata} from "../services/metadata"
import {setLabels, setRelationshipTypes} from "../ducks/metadata"
import Home from "./Home";

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

  onComplete() {
    loadMetadata().then(metadata => {
      this.props.setLabels(metadata.labels)
      this.props.setRelationshipTypes(metadata.relationships)
    })
  }

  selectComponent(activeGroup) {
    switch (activeGroup) {
      case "Sample Graphs":
        return {header: "Sample Graphs", view: <Datasets onComplete={this.onComplete.bind(this)}/> }
      case  "Home":
        return {header: "Graph Data Science Playground", view: <Home/> }
      default:
        return {header: "", view: <MainContent onComplete={this.onComplete.bind(this)} limit={limit}/> }
    }
  }

  render() {
    const { activeGroup, activeAlgorithm, selectAlgorithm, limit } = this.props

    const {header, view} = this.selectComponent(activeGroup)

    return (
      <Container fluid style={{ display: 'flex' }}>
          <AlgorithmsGroupMenu/>
        <div style={{width: '100%'}}>
          <Segment basic inverted vertical={false}
                   style={{ height: '5em', display: 'flex', justifyContent: 'space-between', marginBottom: '0' }}>
            {header ? <Header as='h1' inverted color='grey' style={{marginTop: '0'}}>
              {header}
            </Header> : null}
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
          {view}
        </div>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  limit: state.settings.limit
})

const mapDispatchToProps = dispatch => ({
  updateLimit: value => dispatch(limit(value)),
  setLabels: labels => dispatch(setLabels(labels)),
  setRelationshipTypes: relationshipTypes => dispatch(setRelationshipTypes(relationshipTypes))
})

export default connect(mapStateToProps, mapDispatchToProps)(NEuler)
