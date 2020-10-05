import {Image, Icon, Menu, List, Divider} from "semantic-ui-react"
import React from "react"
import {connect} from "react-redux"
import {selectGroup} from "../ducks/algorithms"

const menuItemStyle = {}

const defaultIconStyle = {
    padding: '2em 2em 3em 2em'
}

const menuStyle = {
    borderRadius: '0',
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    // width: '6em'
}

const topBarStyle = {
    height: '100%'
}

const navStyle = {
    padding: "15px"
}

const AlgorithmsGroupMenu = ({activeGroup, selectGroup, setAboutActive, setDatasetsActive}) =>
    <header
        style={{display: "flex", justifyContent: "space-between", height: "50px", background: "#000", color: "#fff"}}>
        <div style={navStyle}>

            <nav>
                <a href="#" className="header-right-separator" onClick={() => selectGroup("Home")}>NEuler
                    </a>

                <a href="#" onClick={() => selectGroup("Centralities")}>
                    Run Algorithms
                </a>
                <a href="#" onClick={() => setDatasetsActive(true)}>
                    Import Sample Graph
                </a>
            </nav>
        </div>
        <div style={navStyle}>
            <nav>

                <a href="#" onClick={() => setAboutActive(true)}>Versions</a>
            </nav>
        </div>
    </header>


// <Menu inverted borderless>
//
//         <Menu.Item active={activeGroup === 'Home'} as='a' onClick={() => selectGroup('Home')}
//                    style={menuItemStyle}>
//             NEuler - Data Science Playground
//         </Menu.Item>
//         <Menu.Item title='Run Algorithm' active={activeGroup === 'Centralities'} as='a'
//                    onClick={() => selectGroup('Centralities')}
//                    style={menuItemStyle}>
//             Run Algorithms
//         </Menu.Item>
//
//         {/*<Menu.Item title='Recipes' active={activeGroup === 'Recipes'} as='a'*/}
//         {/*           onClick={() => selectGroup('Recipes')}*/}
//         {/*           style={menuItemStyle}>*/}
//         {/*    <Icon size='big' name='book' color='grey'/>*/}
//         {/*</Menu.Item>*/}
//
//
//     <Menu.Menu position='right'>
//         <Menu.Item title='Sample Graphs' active={activeGroup === 'Sample Graphs'} as='a'
//                    onClick={() => setDatasetsActive(true)}
//
//                    style={menuItemStyle}>
//             <Image size='mini' src='images/datasetin.png'/>
//             Sample Graphs
//         </Menu.Item>
//         <Menu.Item title='About' active={activeGroup === 'About'} as='a' onClick={() => setAboutActive(true)}
//                    style={menuItemStyle}
//                 >
//             <Image size='mini' src='images/neo4j_logo_globe1.png'/>
//             Versions
//         </Menu.Item>
//     </Menu.Menu>
//
// </Menu>


const mapStateToProps = state => ({
    activeGroup: state.algorithms.group
})

const mapDispatchToProps = dispatch => ({
    selectGroup: group => dispatch(selectGroup(group))
})

export default connect(mapStateToProps, mapDispatchToProps)(AlgorithmsGroupMenu)
