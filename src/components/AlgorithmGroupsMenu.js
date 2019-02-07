import { Menu, Icon } from "semantic-ui-react"
import React from "react"
import { connect } from "react-redux"
import { selectGroup } from "../ducks/algorithms"

const AlgorithmsGroupMenu = ({activeGroup, selectGroup}) => <div>
  <Menu.Item active={activeGroup === 'Centralities'} as='a' onClick={() => selectGroup('Centralities')}>
    <Icon name='sun'/>
    Centralities
  </Menu.Item>
  <Menu.Item active={activeGroup === 'Community Detection'} as='a' onClick={() => selectGroup('Community Detection')}>
    <Icon name='group'/>
    Community Detection
  </Menu.Item>
  {/*<Menu.Item as='a'>
    <Icon name='connectdevelop'/>
    Path Finding
  </Menu.Item>
  <Menu.Item as='a'>
    <Icon name='clone'/>
    Similarities
  </Menu.Item>*/}
</div>

const mapStateToProps = state => ({
  activeGroup: state.algorithms.group
})

const mapDispatchToProps = dispatch => ({
  selectGroup: group => dispatch(selectGroup(group))
})

export default connect(mapStateToProps, mapDispatchToProps)(AlgorithmsGroupMenu)