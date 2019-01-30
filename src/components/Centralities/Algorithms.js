import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Card, Icon, Header } from 'semantic-ui-react'

import PageRankForm from './PageRankForm'
import BetweennesForm from './BetweennesForm'
import ApproxBetweennessForm from './ApproxBetweennessForm'
import ClosenessCentralityForm from './ClosenessCentralityForm'
import HarmonicCentralityForm from './HarmonicCentralityForm'
import { pageRank, articleRank, betweenness, approxBetweenness, closeness, harmonic } from "../../services/centralities"

import { v4 as generateTaskId } from 'uuid'
import { addTask, completeTask } from "../../ducks/tasks"

class Algorithms extends Component {
  state = {
    collapsed: false,
    labelOptions: [
      { key: null, value: null, text: 'All labels' },
      { key: 'Character', value: 'Character', text: 'Character' }
    ],
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
      case 'Article Rank':
        service = articleRank
        break
      case 'Betweenness':
        service = betweenness
        break
      case 'Approx Betweenness':
        service = approxBetweenness
        break
      case 'Closeness':
        service = closeness
        break
      case 'Harmonic':
        service = harmonic
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
      margin: '0 2em',
      width: '96%',
      overflow: 'hidden'
    }

    let toggleIcon = 'angle double up'

    if (this.state.collapsed) {
      containerStyle.height = '15em';
      toggleIcon = 'angle double down'
    }

    return (
      <div>
        <div style={containerStyle}>
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
                  <PageRankForm {...this.state.parameters['Page Rank']} labelOptions={this.state.labelOptions} onChange={this.onChangeParam.bind(this, 'Page Rank')}/>
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
                <Icon name='sitemap'/>
                <Card.Header>Article Rank</Card.Header>
                <Card.Meta>a variant of the PageRank algorithm</Card.Meta>
                <Card.Description>
                  PageRank assumes that relationships from nodes that have a low out-degree are more important than
                  relationships from nodes with a higher out-degree.
                  ArticleRank weakens this assumption.
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div>
                  <PageRankForm {...this.state.parameters['Article Rank']} labelOptions={this.state.labelOptions}
                                onChange={this.onChangeParam.bind(this, 'Article Rank')}/>
                </div>
                <div className='ui two buttons'>
                  <Button basic color='green' onClick={this.onRunAlgo.bind(this, 'Article Rank')}>
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
                  <BetweennesForm {...this.state.parameters['Betweenness']} labelOptions={this.state.labelOptions}
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

            <Card>
              <Card.Content>
                <Icon name='connectdevelop'/>
                <Card.Header>Approx Betweenness Centrality</Card.Header>
                <Card.Meta>RA-Brandes algorithm is the best known algorithm for calculating an approximate score for
                  betweenness centrality</Card.Meta>
                <Card.Description>
                  Rather than calculating the shortest path between every pair of nodes, the RA-Brandes algorithm
                  considers only a subset of nodes.
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div>
                  <ApproxBetweennessForm {...this.state.parameters['Approx Betweenness']} labelOptions={this.state.labelOptions}
                                         onChange={this.onChangeParam.bind(this, 'Approx Betweenness')}/>
                </div>
                <div className='ui two buttons'>
                  <Button basic color='green' onClick={this.onRunAlgo.bind(this, 'Approx Betweenness')}>
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
                <Card.Header>Closeness Centrality</Card.Header>
                <Card.Meta>detect nodes that are able to spread information very efficiently through a graph</Card.Meta>
                <Card.Description>
                  The closeness centrality of a node measures its average farness (inverse distance) to all other nodes.
                  Nodes with a high closeness score have the shortest distances to all other nodes.
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div>
                  <ClosenessCentralityForm {...this.state.parameters['Closeness']} labelOptions={this.state.labelOptions}
                                           onChange={this.onChangeParam.bind(this, 'Closeness')}/>
                </div>
                <div className='ui two buttons'>
                  <Button basic color='green' onClick={this.onRunAlgo.bind(this, 'Closeness')}>
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
                <Card.Header>Harmonic Centrality</Card.Header>
                <Card.Meta>a variant of closeness centrality, that was invented to solve the problem the original
                  formula had when dealing with unconnected graphs.</Card.Meta>
                <Card.Description>
                  Harmonic centrality was proposed by Marchiori and Latora in Harmony in the Small World while trying to
                  come up with a sensible notion of "average shortest path".
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div>
                  <HarmonicCentralityForm {...this.state.parameters['Harmonic']} labelOptions={this.state.labelOptions} 
                                          onChange={this.onChangeParam.bind(this, 'Harmonic')}/>
                </div>
                <div className='ui two buttons'>
                  <Button basic color='green' onClick={this.onRunAlgo.bind(this, 'Harmonic')}>
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
        <div style={{ width: '100%', textAlign: 'center', paddingTop: '1em' }}>
          <Button icon size='mini' onClick={this.toggleCollapse.bind(this)}>
            <Icon name={toggleIcon}/>
          </Button>
        </div>
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
