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
  height: '100vh'
}

const AlgorithmsGroupMenu = ({ activeGroup, selectGroup, children }) => <Menu vertical={true} inverted style={menuStyle}>
  <Menu.Item active={activeGroup === 'Centralities'} as='a' onClick={() => selectGroup('Centralities')}
             style={menuItemStyle}>
    <Icon name='sun'/>
    Centralities
  </Menu.Item>
  <Menu.Item active={activeGroup === 'Community Detection'} as='a' onClick={() => selectGroup('Community Detection')}
             style={menuItemStyle}>
    <Icon name='group'/>
    Community Detection
  </Menu.Item>
  <Menu.Item active={activeGroup === 'Load datasets'} as='a' onClick={() => selectGroup('Load datasets')}
             style={menuItemStyle}>
    <Icon name='group'/>
    Load datasets
  </Menu.Item>
  <Menu.Item>
  {children}
  </Menu.Item>
  {/*<Menu.Item as='a'>
    <Icon name='connectdevelop'/>
    Path Finding
  </Menu.Item>
  <Menu.Item as='a'>
    <Icon name='clone'/>
    Similarities
  </Menu.Item>*/}
</Menu>

const mapStateToProps = state => ({
  activeGroup: state.algorithms.group
})

const mapDispatchToProps = dispatch => ({
  selectGroup: group => dispatch(selectGroup(group))
})

export default connect(mapStateToProps, mapDispatchToProps)(AlgorithmsGroupMenu)
