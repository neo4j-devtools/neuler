import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Card, Icon, Header } from 'semantic-ui-react'

import CentralityForm from './Centralities/PageRankForm'
import BetweennesForm from './Centralities/BetweennesForm'
import { pageRank } from "../services/centralities"

import { v4 as generateTaskId } from 'uuid'
import { addTask, completeTask } from "../ducks/tasks"

class Algorithms extends Component {
  state = {
    parameters: {
      pageRank: {
        direction: 'Outgoing'
      }
    }
  }
  render() {
    const { addTask, completeTask } = this.props
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
                <CentralityForm {...this.state.parameters.pageRank} onChange={(key, value) => {
                  const parameters = {...this.state.parameters}
                  if (!parameters['pageRank']) {
                    parameters['pageRank'] = {}
                  }
                  parameters['pageRank'][key] = value
                  this.setState({
                    parameters
                  })
                }}/>
              </div>
              <div className='ui two buttons'>
                <Button basic color='green' onClick={() => {
                  const taskId = generateTaskId()

                  pageRank({
                    taskId,
                    ...this.state.parameters['pageRank']
                  }).then(result => {
                    console.log(result)
                    completeTask(taskId, result)
                  })

                  addTask(taskId, 'Page Rank')

                }}>
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
                <BetweennesForm/>
              </div>
              <div className='ui two buttons'>
                <Button basic color='green'>
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
  addTask: (taskId, algorithm) => {
    const task = {
      algorithm,
      taskId,
      startTime: new Date()
    }
    dispatch(addTask({ ...task }))
  },
  completeTask: (taskId, result) => {
    dispatch(completeTask({ taskId, result }))
  }
})

export default connect(null, mapDispatchToProps)(Algorithms)
