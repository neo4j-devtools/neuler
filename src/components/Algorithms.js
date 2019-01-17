import React from 'react'
import { Button, Card, Icon, Header } from 'semantic-ui-react'

import CentralityForm from './CentralityForm'
import BetweennesForm from './BetweennesForm'

export default () => (
  <div style={{ margin: '0 2em', width: '99%' }}>
    <Header as='h2'>Centrality Algorithms</Header>
    <Card.Group>
      <Card>
        <Card.Content>
          <Icon name='sitemap'/>
          <Card.Header>Page Rank</Card.Header>
          <Card.Meta>named after Google co-founder Larry Page</Card.Meta>
          <Card.Description>
            PageRank is an algorithm that measures the <strong>transitive</strong> influence or connectivity of nodes
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div>
            <CentralityForm/>
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
      <Card>
        <Card.Content>
          <Icon name='connectdevelop'/>
          <Card.Header>Betweenness Centrality</Card.Header>
          <Card.Meta>first formal definition by Linton Freeman, 1971</Card.Meta>
          <Card.Description>
            Betweenness centrality is a way of detecting the amount of influence a node has over the flow of information in a graph.
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
