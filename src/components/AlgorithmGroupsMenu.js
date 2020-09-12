import {Image, Icon, Menu} from "semantic-ui-react"
import React from "react"
import {connect} from "react-redux"
import {selectGroup} from "../ducks/algorithms"

const menuItemStyle = {
    padding: '2em'
}

const defaultIconStyle = {
    padding: '2em 2em 3em 2em'
}

const menuStyle = {
    borderRadius: '0',
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    width: '6em'
}

const topBarStyle = {
    height: '100%'
}

const AlgorithmsGroupMenu = ({activeGroup, selectGroup, children}) =>
    <Menu vertical={true} inverted style={menuStyle}>
        <div style={topBarStyle}>
            <Menu.Item active={activeGroup === 'Home'} as='a' onClick={() => selectGroup('Home')}
                       style={defaultIconStyle}>
                <Icon size='big' name='home' color='grey'/>
            </Menu.Item>
            <Menu.Item title='Centralities' active={activeGroup === 'Centralities'} as='a' onClick={() => selectGroup('Centralities')}
                       style={menuItemStyle}>
                <Image size='mini' src='images/Centrality-Algo-Icon.png' />
            </Menu.Item>
            <Menu.Item title='Community Detection' active={activeGroup === 'Community Detection'} as='a'
                       onClick={() => selectGroup('Community Detection')}
                       style={menuItemStyle}>
                <Image size='mini' src='images/Community-Algo-Icon.png' />
            </Menu.Item>
            <Menu.Item title='Path Finding' active={activeGroup === 'Path Finding'} as='a'
                       onClick={() => selectGroup('Path Finding')}
                       style={menuItemStyle}>
                <Image size='mini' src='images/Pathfinding-Algo-Icon.png' />
            </Menu.Item>

            <Menu.Item title='Similarity' active={activeGroup === 'Similarity'} as='a'
                       onClick={() => selectGroup('Similarity')}
                       style={menuItemStyle}>
                <Image size='mini' src='images/Similarity-Algo-Icon.png' />
            </Menu.Item>
        </div>
        <div>
            <Menu.Item title='Sample Graphs' active={activeGroup === 'Sample Graphs'} as='a' onClick={() => selectGroup('Sample Graphs')}
                       style={menuItemStyle}>
                <Image size='mini' src='images/datasetin.png' />
            </Menu.Item>
            <Menu.Item title='About' active={activeGroup === 'About'} as='a' onClick={() => selectGroup('About')}
                       style={menuItemStyle}>
                <Image size='mini' src='images/neo4j_logo_globe1.png' />
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
