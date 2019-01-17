import React from 'react'
import { Grid } from 'semantic-ui-react'

import Algorithms from './Algorithms'
import AlgoResults from './AlgoResults'

export default () =>
    <Grid divided='vertically' columns={1}>
      <Grid.Row>
        <Algorithms/>
      </Grid.Row>
      <Grid.Row style={{padding: '2em 10em 0em 2em'}}>
        <AlgoResults/>
      </Grid.Row>
    </Grid>