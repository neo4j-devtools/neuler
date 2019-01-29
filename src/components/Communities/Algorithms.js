import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Card, Icon, Header } from 'semantic-ui-react'

import LouvainForm from './LouvainForm'
import { louvain } from "../../services/communityDetection"

import { v4 as generateTaskId } from 'uuid'
import { addTask, completeTask } from "../../ducks/tasks"

class Algorithms extends Component {
  state = {
    parameters: {
      'Louvain': {
        direction: 'Outgoing',
        persist: false,
        writeProperty: "louvain",
        defaultValue: 1
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
      case 'Louvain':
        service = louvain
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

      this.props.addTask(taskId, algorithm, {...this.state.parameters[algorithm]})
    }
  }

  render() {
    return (
      <div style={{ margin: '0 2em', width: '96%' }}>
        <Header as='h2'>Community Detection Algorithms</Header>
        <Card.Group>
          <Card>
            <Card.Content>
              <Icon name='sitemap'/>
              <Card.Header>Louvain</Card.Header>
              <Card.Meta>named after Google co-founder Larry Page</Card.Meta>
              <Card.Description>
                PageRank is an algorithm that measures the <strong>transitive</strong> influence or connectivity of
                nodes
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div>
                <LouvainForm {...this.state.parameters['Louvain']}
                                onChange={this.onChangeParam.bind(this, 'Louvain')}/>
              </div>
              <div className='ui two buttons'>
                <Button basic color='green' onClick={this.onRunAlgo.bind(this, 'Louvain')}>
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
