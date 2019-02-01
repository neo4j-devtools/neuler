import React from 'react'
import { Grid } from 'semantic-ui-react'

import AlgorithmForm from './AlgorithmForm'
import AlgoResults from './AlgoResults'

export default () =>
  <Grid columns={2}>
      <Grid.Row style={{margin: '0', padding: '0'}}>
        <Grid.Column width={3}>
          <AlgorithmForm/>
        </Grid.Column>
        <Grid.Column width={13}>
        <AlgoResults/>
        </Grid.Column>
      </Grid.Row>
    </Grid>
