import React from 'react'
import { connect } from "react-redux"
import { Card, Segment, Grid, Button, Image, Dropdown } from 'semantic-ui-react'
import { v4 as generateTaskId } from 'uuid'

import DashboardItem from './Dashboard/DashboardItem'
import { addItem, completeItem } from "../ducks/dashboard"
import { getSuperNodes } from "../services/centralities"

const options = [{
  key: 'table', icon: 'table', text: 'table', value: 'table'
}, {
  key: 'chart', icon: 'chart bar', text: 'chart', value: 'chart'
}]

const Dashboard = ({ items, onSuperNodes }) => <Grid style={{ margin: '1em' }}>
  <Grid>
    <Grid.Column>
      <Card>
        <Card.Content>
          <Card.Header>Add Quick Insights</Card.Header>
        </Card.Content>
        <Card.Content>
          <Segment vertical>
            <Button.Group color='green'>
              <Button basic color='green'>Degree Statistics</Button>
              <Dropdown
                as={Button}
                className='icon'
                floating
                options={options}
                trigger={<React.Fragment/>}
              />
            </Button.Group>
          </Segment>
          <Segment vertical>
            <Button.Group color='green'>
              <Button basic color='green'>Super Nodes</Button>
              <Dropdown
                as={Button}
                className='icon'
                floating
                options={options}
                trigger={<React.Fragment/>}
                onChange={(e, { value }) => onSuperNodes('Super Nodes', value)}
              />
            </Button.Group>
          </Segment>
        </Card.Content>
      </Card>
    </Grid.Column>
  </Grid>
  {
    items.map(item => <DashboardItem key={item.id} {...item}/>)
  }
</Grid>

const mapStateToProps = state => ({
  items: state.dashboard.items
})

const mapDispatchToProps = dispatch => ({
  onSuperNodes: (name, mode) => {
    const id = generateTaskId()
    dispatch(addItem(id, name, mode, null))
    getSuperNodes().then(result => {
      dispatch(completeItem(id, result))
    })
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)