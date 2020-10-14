import {Dropdown, Icon, Image} from "semantic-ui-react"
import React from "react"
import {connect} from "react-redux"
import {selectGroup} from "../ducks/algorithms"
import {selectMenuItem} from "../ducks/menu";
import {Link, NavLink} from "react-router-dom";

const navStyle = {
    padding: "11px"
}

const AlgorithmsGroupMenu = ({setAboutActive, setDatasetsActive}) =>
    <header
        style={{display: "flex", justifyContent: "space-between", background: "#000", color: "#fff", height: "37px"}}>
        <div style={{display: "flex"}}>
            <Image src="images/noun_Sandbox Toys_1207953.png" style={{height: "37px"}} />
            <span style={{padding: "10px 0 10px 0"}}>NEuler</span>
        </div>
        <div style={navStyle}>
            <nav>
                <NavLink exact={true} activeClassName="selected" to="/">Home</NavLink>
                <NavLink activeClassName="selected" to="/algorithms">Run Algorithms</NavLink>
                <NavLink activeClassName="selected" to="/database">Configure Database</NavLink>
                {/*<NavLink activeClassName="selected" to="/recipes">Recipes</NavLink>*/}
            </nav>
        </div>
        <div style={navStyle}>
            <nav>

                <Dropdown icon={<Icon name="setting" size="large" />} direction="right" className="big">
                    <Dropdown.Menu style={{ left: 'auto', right: 0, marginTop: "9px" }}>
                        <Dropdown.Item onClick={() => setDatasetsActive(true)}>Sample Graphs</Dropdown.Item>
                        <Dropdown.Item onClick={() => setAboutActive(true)}>Versions</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
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
    activeAlgorithm: state.algorithms.algorithm,
    activeMenuItem: state.menu.item,
})

const mapDispatchToProps = dispatch => ({
    selectGroup: group => dispatch(selectGroup(group)),
    selectMenuItem: item => dispatch(selectMenuItem(item))
})

export default connect(mapStateToProps, mapDispatchToProps)(AlgorithmsGroupMenu)
