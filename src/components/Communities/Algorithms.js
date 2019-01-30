import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Card, Icon, Header } from 'semantic-ui-react'

import LouvainForm from './LouvainForm'
import LabelPropagationForm from './LabelPropagationForm'
import ConnectedComponentsForm from './ConnectedComponentsForm'
import StronglyConnectedComponentsForm from './StronglyConnectedComponentsForm'
import { louvain, lpa, connectedComponents, stronglyConnectedComponents } from "../../services/communityDetection"

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
      },
      'LPA': {
        direction: 'Outgoing',
        persist: false,
        writeProperty: "lpa",
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
      case 'LPA':
        service = lpa
        break
      case "Connected Components":
        service = connectedComponents
      case "Strongly Connected Components":
        service = stronglyConnectedComponents
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
              <Card.Meta>one of the fastest modularity-based algorithms and also reveals a hierarchy of communities at different scales</Card.Meta>
              <Card.Description>
                The "Louvain algorithm" was proposed in 2008 by authors from the University of Louvain.
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

          <Card>
            <Card.Content>
              <Icon name='sitemap'/>
              <Card.Header>Label Propagation</Card.Header>
              <Card.Meta> a fast algorithm for finding communities in a graph</Card.Meta>
              <Card.Description>
                LPA is a relatively new algorithm, and was only proposed by Raghavan et al in 2007
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div>
                <LabelPropagationForm {...this.state.parameters['LPA']}
                                onChange={this.onChangeParam.bind(this, 'LPA')}/>
              </div>
              <div className='ui two buttons'>
                <Button basic color='green' onClick={this.onRunAlgo.bind(this, 'LPA')}>
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
              <Icon name='sitemap'/>
              <Card.Header>Connected Components</Card.Header>
              <Card.Meta>finds sets of connected nodes in an undirected graph where each node is reachable from any other node in the same set</Card.Meta>
              <Card.Description>
                The algorithm was first described by Bernard A. Galler and Michael J. Fischer in 1964.
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div>
                <ConnectedComponentsForm {...this.state.parameters['Connected Components']}
                                onChange={this.onChangeParam.bind(this, 'Connected Components')}/>
              </div>
              <div className='ui two buttons'>
                <Button basic color='green' onClick={this.onRunAlgo.bind(this, 'Connected Components')}>
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
            <Icon name='sitemap'/>
            <Card.Header>Strongly Connected Components</Card.Header>
            <Card.Meta>finds sets of connected nodes in a directed graph where each node is reachable in both directions from any other node in the same set.</Card.Meta>
            <Card.Description>
              SCC is one of the earliest graph algorithms, and the first linear-time algorithm was described by Tarjan in 1972
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <div>
              <StronglyConnectedComponentsForm {...this.state.parameters['Strongly Connected Components']}
                              onChange={this.onChangeParam.bind(this, 'Strongly Connected Components')}/>
            </div>
            <div className='ui two buttons'>
              <Button basic color='green' onClick={this.onRunAlgo.bind(this, 'Strongly Connected Components')}>
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
