import { Menu, Icon, Dropdown, Header } from "semantic-ui-react"
import React from "react"
import { connect } from "react-redux"
import { selectGroup } from "../ducks/algorithms"
import { getAlgorithms } from "./algorithmsLibrary"

const menuItemStyle = {
  padding: '2em'
}

const menuStyle = {
  borderRadius: '0',
  width: '12em',
  height: '100vh',
  display: 'flex',
  justifyContent: 'space-between'
}

const topBarStyle = {
  height: '100%'
}

const menuDivStyle = {
  display: 'flex',
  alignItems: 'center',
  margin: '0 0.5em'
}

const menuDDStyle = {
  paddingLeft: 0
}

const AlgorithmsGroupMenu = ({ activeGroup, selectGroup, children, selectAlgorithm }) =>
  <Menu inverted>
      {/*<Menu.Item active={activeGroup === 'Home'} as='a' onClick={() => selectGroup('Home')}
                 style={menuItemStyle}>
        <Icon name='sun'/>
        Home
      </Menu.Item>*/}
    {/*  <Menu.Item active={activeGroup === 'Centralities'} as='a' onClick={() => selectGroup('Centralities')}
                 style={menuItemStyle}>
        <Icon name='sun'/>
        Centralities
      </Menu.Item>
      <Menu.Item active={activeGroup === 'Community Detection'} as='a'
                 onClick={() => selectGroup('Community Detection')}
                 style={menuItemStyle}>
        <Icon name='group'/>
        Community Detection
      </Menu.Item>
      <Menu.Item active={activeGroup === 'Path Finding'} as='a'
                 onClick={() => selectGroup('Path Finding')}
                 style={menuItemStyle}>
        <Icon name='snowflake'/>
        Path Finding
      </Menu.Item>*/}
    <div style={menuDivStyle} onClick={() => selectGroup('Home')}>
      <Header inverted> <Icon name='home'/> Home </Header>
    </div>
    <div style={menuDivStyle}>
      <Icon name='sun'/>
      <Dropdown item text='Centralities' style={menuDDStyle}>
        <Dropdown.Menu>
          {getAlgorithms('Centralities').map(algorithm =>
            <Dropdown.Item key={algorithm} as='a'
                           onClick={() => selectAlgorithm(algorithm)}>
              {algorithm}
            </Dropdown.Item>)}
        </Dropdown.Menu>
      </Dropdown>
    </div>
    <div style={menuDivStyle}>
      <Icon name='group'/>
      <Dropdown item text='Community Detection' style={menuDDStyle}>
        <Dropdown.Menu>
          {getAlgorithms('Community Detection').map(algorithm =>
            <Dropdown.Item key={algorithm} as='a'
                           onClick={() => selectAlgorithm(algorithm)}>
              {algorithm}
            </Dropdown.Item>)}
        </Dropdown.Menu>
      </Dropdown>
    </div>
    <div style={menuDivStyle}>
      <Icon name='snowflake'/>
      <Dropdown item text='Path Finding' style={menuDDStyle}>
        <Dropdown.Menu>
          {getAlgorithms('Path Finding').map(algorithm =>
            <Dropdown.Item key={algorithm} as='a'
                           onClick={() => selectAlgorithm(algorithm)}>
              {algorithm}
            </Dropdown.Item>)}
        </Dropdown.Menu>
      </Dropdown>
    </div>
    {/*<div>
      <Menu.Item active={activeGroup === 'Sample Graphs'} as='a' onClick={() => selectGroup('Sample Graphs')}
                 style={menuItemStyle}>
        <Icon name='database'/>
        Sample Graphs
      </Menu.Item>
      <Menu.Item>
        {children}
      </Menu.Item>
    </div>*/}
  </Menu>



const mapStateToProps = state => ({
  activeGroup: state.algorithms.group
})

const mapDispatchToProps = dispatch => ({
  selectGroup: group => dispatch(selectGroup(group))
})

export default connect(mapStateToProps, mapDispatchToProps)(AlgorithmsGroupMenu)
