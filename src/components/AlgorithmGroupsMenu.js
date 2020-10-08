import {Image, Icon, Dropdown, Menu, List, Divider} from "semantic-ui-react"
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
    padding: "0.67rem"
}

const AlgorithmsGroupMenu = ({activeGroup, selectGroup, setAboutActive, setDatasetsActive}) =>
    <header
        style={{display: "flex", justifyContent: "space-between", background: "#000", color: "#fff", height: "39px"}}>
        <div style={{display: "flex"}}>
            <Image src="images/noun_Sandbox Toys_1207953.png" style={{height: "39px"}} />
            <span style={{padding: "10px 0 10px 0"}}>NEuler</span>
        </div>
        <div style={navStyle}>
            <nav>
                <a href="#" onClick={() => selectGroup("Home")} className={activeGroup === "Home" ? "selected" : null}>Home
                </a>

                <a href="#" onClick={() => selectGroup("Database")} className={activeGroup === "Database" ? "selected" : null}>Select Database
                </a>

                <a href="#" onClick={() => selectGroup("Recipes")} className={activeGroup === "Recipes" ? "selected" : null}>
                    Run Algorithm Recipes
                </a>

                <a href="#" onClick={() => selectGroup("Centralities")} className={activeGroup === "Centralities" ? "selected" : null}>
                    Run Single Algorithm
                </a>

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
    activeGroup: state.algorithms.group
})

const mapDispatchToProps = dispatch => ({
    selectGroup: group => dispatch(selectGroup(group))
})

export default connect(mapStateToProps, mapDispatchToProps)(AlgorithmsGroupMenu)
