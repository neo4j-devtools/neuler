import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Card, Icon, Header } from 'semantic-ui-react'

import CentralityForm from './Centralities/PageRankForm'
import BetweennesForm from './Centralities/BetweennesForm'
import { betweenness, pageRank } from "../services/centralities"

import { v4 as generateTaskId } from 'uuid'
import { addTask, completeTask } from "../ducks/tasks"

class Algorithms extends Component {
  state = {
    parameters: {
      'Page Rank': {
        direction: 'Outgoing'
      },
      'Betweenness': {
        direction: 'Outgoing'
      }
    }
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

    let service

    switch (algorithm) {
      case 'Page Rank':
        service = pageRank
        break
      case 'Betweenness':
        service = betweenness
        break
      default:
        break
    }

    if (service) {
      service({
        taskId,
        ...this.state.parameters[algorithm]
      }).then(result => {
        console.log(result)
        this.props.completeTask(taskId, result)
      })

      this.props.addTask(taskId, algorithm, this.state.parameters[algorithm])
    }
  }

  render() {
    return (
      <div style={{ margin: '0 2em', width: '99%' }}>
        <Header as='h2'>Centrality Algorithms</Header>
        <Card.Group>
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
                <CentralityForm {...this.state.parameters['Page Rank']}
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
          <Card>
            <Card.Content>
              <Icon name='connectdevelop'/>
              <Card.Header>Betweenness Centrality</Card.Header>
              <Card.Meta>first formal definition by Linton Freeman, 1971</Card.Meta>
              <Card.Description>
                Betweenness centrality is a way of detecting the amount of influence a node has over the flow of
                information in a graph.
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div>
                <BetweennesForm {...this.state.parameters['Betweenness']}
                                onChange={this.onChangeParam.bind(this, 'Betweenness')}/>
              </div>
              <div className='ui two buttons'>
                <Button basic color='green' onClick={this.onRunAlgo.bind(this, 'Betweenness')}>
                  Run
                </Button>
                <Button basic color='red'>
                  Cancel
                </Button>
              </div>
            </Card.Content>
          </Card>
        </Card.Group>
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
