import React from 'react'
import { Table, Tab, Header } from 'semantic-ui-react'

const panes = [
  { menuItem: 'Centrality - Page Rank - 30 mins ago', render: () => <Tab.Pane>
      <Table color='green'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Page Rank</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Apples</Table.Cell>
            <Table.Cell>2.10</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Oranges</Table.Cell>
            <Table.Cell>1.90</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Bananas</Table.Cell>
            <Table.Cell>1.70</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
      </Tab.Pane> },
  { menuItem: 'Community Detection - Louvain - 45 mins ago', render: () => <Tab.Pane>Tab 2 Content</Tab.Pane> },
  { menuItem: 'Centrality - Betweenness - 1 hour ago', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
]

const TabExampleVerticalTabular = () => (
  <div style={{ width: '95%' }}>
    <Header as='h2'>Run Results</Header>
    <Tab menu={{ fluid: true, vertical: true, tabular: true }} panes={panes}/>
  </div>
)

export default TabExampleVerticalTabular