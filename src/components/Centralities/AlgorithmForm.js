import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Card, Icon, Header } from 'semantic-ui-react'

import PageRankForm from './PageRankForm'
import BetweennesForm from './BetweennesForm'
import ApproxBetweennessForm from './ApproxBetweennessForm'
import ClosenessCentralityForm from './ClosenessCentralityForm'
import HarmonicCentralityForm from './HarmonicCentralityForm'
import { pageRank, articleRank, betweenness, approxBetweenness, closeness, harmonic } from "../../services/centralities"
import { loadLabels, loadRelationshipTypes } from "../../services/metadata"

import { v4 as generateTaskId } from 'uuid'
import { addTask, completeTask } from "../../ducks/tasks"

class Algorithms extends Component {
  state = {
    collapsed: false,
    parameters: {
      'Page Rank': {
        direction: 'Outgoing',
        persist: false,
        writeProperty: "pagerank",
        dampingFactor: 0.85,
        iterations: 20,
        defaultValue: 1
      },
      'Article Rank': {
        direction: 'Outgoing',
        persist: false,
        writeProperty: "articlerank",
        dampingFactor: 0.85,
        iterations: 20,
        defaultValue: 1
      },
      'Betweenness': {
        direction: 'Outgoing',
        persist: false,
        writeProperty: "betweenness"
      },
      'Approx Betweenness': {
        strategy: "random"
      }
    }
  }

  componentDidMount() {
    loadLabels().then(result => {
      const labels = result.rows.map(row => {
        return { key: row.label, value: row.label, text: row.label }
      })
      labels.unshift({ key: null, value: null, text: 'Any' })
      this.setState({
        labelOptions: labels,
      })
    })

    loadRelationshipTypes().then(result => {
      const relationshipTypes = result.rows.map(row => {
        return { key: row.label, value: row.label, text: row.label }
      })
      relationshipTypes.unshift({ key: null, value: null, text: 'Any' })
      this.setState({
        relationshipTypeOptions: relationshipTypes
      })
    })

  }

  onChangeParam(algorithm, key, value) {
    const parameters = { ...this.state.parameters }
    if (!parameters[algorithm]) {
      parameters[algorithm] = {}
    }
    parameters[algorithm][key] = value
    this.setState({
      parameters
    })
  }

  onRunAlgo(algorithm) {
    const taskId = generateTaskId()

    let service = pageRank

    if (service) {
      service({
        taskId,
        ...this.state.parameters[algorithm]
      }).then(result => {
        console.log(result)
        this.props.completeTask(taskId, result)
        this.setState({ collapsed: true })
      })

      this.props.addTask(taskId, algorithm, { ...this.state.parameters[algorithm] })
    }
  }

  toggleCollapse() {
    this.setState(({ collapsed }) => ({ collapsed: !collapsed }))
  }

  render() {

    const containerStyle = {
      width: '96%',
      overflow: 'hidden'
    }

    let toggleIcon = 'angle double up'

    if (this.state.collapsed) {
      // containerStyle.height = '15em';
      toggleIcon = 'angle double down'
    }

    return (
      <div style={containerStyle}>
        <Card>
          <Card.Content>
            <Icon name='sitemap'/>
            <Card.Header>Page Rank</Card.Header>
            <Card.Meta>named after Google co-founder Larry Page</Card.Meta>
            <Card.Description>
              PageRank is an algorithm that measures the <strong>transitive</strong> influence or connectivity of
              nodes
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <div>
              <PageRankForm {...this.state.parameters['Page Rank']} labelOptions={this.state.labelOptions}
                            relationshipTypeOptions={this.state.relationshipTypeOptions}
                            onChange={this.onChangeParam.bind(this, 'Page Rank')}/>
            </div>
            <div className='ui two buttons'>
              <Button basic color='green' onClick={this.onRunAlgo.bind(this, 'Page Rank')}>
                Run
              </Button>
              <Button basic color='red'>
                Cancel
              </Button>
            </div>
          </Card.Content>
        </Card>
        {/* <div style={{ width: '100%', textAlign: 'center', paddingTop: '1em' }}>
          <Button icon size='mini' onClick={this.toggleCollapse.bind(this)}>
            <Icon name={toggleIcon}/>
          </Button>
        </div>*/}

      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  addTask: (taskId, algorithm, parameters) => {
    const task = {
      algorithm,
      taskId,
      parameters,
      startTime: new Date()
    }
    dispatch(addTask({ ...task }))
  },
  completeTask: (taskId, result) => {
    dispatch(completeTask({ taskId, result }))
  }
})

export default connect(null, mapDispatchToProps)(Algorithms)
