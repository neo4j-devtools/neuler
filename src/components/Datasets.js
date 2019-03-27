import {Button, Grid, Icon, Card} from "semantic-ui-react"
import React, { Component } from 'react'
import AlgorithmForm from './AlgorithmForm'
import AlgoResults from './AlgoResults'

class Datasets extends Component {
  render() {
    const containerStyle = {
      display: 'flex',
      width: '96%',
      overflow: 'hidden',
      height: '100%',
      alignItems: 'flex-start'
    }
    return   (<Grid columns={2} style={{height: '90%'}}>
        <Grid.Row style={{margin: '0', padding: '0'}}>
          <Grid.Column width={4} style={{minWidth: '25em'}}>
            <div style={containerStyle}>
              <Card>
                <Card.Content>
                  <Icon name='sitemap'/>
                  <Card.Header>
                    Game of Thrones
                  </Card.Header>
                  <Card.Meta>GoT dataset
                  </Card.Meta>
                </Card.Content>
                <Card.Content extra>
                  <div className='ui two buttons'>
                    <Button basic color='green' >
                      Load
                    </Button>
                  </div>
                </Card.Content>
              </Card>

            </div>
          </Grid.Column>

        </Grid.Row>
      </Grid>)

  }
}

export default Datasets
