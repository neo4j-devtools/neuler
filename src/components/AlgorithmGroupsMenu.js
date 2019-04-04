import { Menu, Icon } from "semantic-ui-react"
import React from "react"
import { connect } from "react-redux"
import { selectGroup } from "../ducks/algorithms"

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

const AlgorithmsGroupMenu = ({ activeGroup, selectGroup, children }) =>
  <Menu vertical={true} inverted style={menuStyle}>
    <div style={topBarStyle}>
      <Menu.Item active={activeGroup === 'Home'} as='a' onClick={() => selectGroup('Home')}
                 style={menuItemStyle}>
        <Icon name='sun'/>
        Home
      </Menu.Item>
      <Menu.Item active={activeGroup === 'Centralities'} as='a' onClick={() => selectGroup('Centralities')}
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
      </Menu.Item>
    </div>
    <div>
      <Menu.Item active={activeGroup === 'Sample Graphs'} as='a' onClick={() => selectGroup('Sample Graphs')}
                 style={menuItemStyle}>
        <Icon name='database'/>
        Sample Graphs
      </Menu.Item>
      <Menu.Item>
        {children}
      </Menu.Item>
    </div>
  </Menu>



const mapStateToProps = state => ({
  activeGroup: state.algorithms.group
})

const mapDispatchToProps = dispatch => ({
  selectGroup: group => dispatch(selectGroup(group))
})

export default connect(mapStateToProps, mapDispatchToProps)(AlgorithmsGroupMenu)
