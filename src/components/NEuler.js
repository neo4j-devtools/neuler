import React from 'react'
import {Container} from "semantic-ui-react"

import AlgorithmsGroupMenu from "./AlgorithmGroupsMenu"
import MainContent from './MainContent'
import Datasets from './Datasets'
import {connect} from "react-redux"
import {limit} from "../ducks/settings"
import {setLabels, setPropertyKeys, setRelationshipTypes} from "../ducks/metadata"
import Home from "./Home";
import About from "./About";
import {FeedbackForm} from "./Feedback/FeedbackForm";
import {refreshMetadata} from "./Startup/startup";
import constants from "../constants.js";
import SelectDatabase from "./SelectDatabase";
import {Recipe} from "./Recipe";

const NEuler = (props) => {
    const {activeGroup, activeMenuItem, activeAlgorithm, selectAlgorithm} = props
    const onComplete = () => {
        refreshMetadata(props)
    }

    const [aboutActive, setAboutActive] = React.useState(false)
    const [datasetsActive, setDatasetsActive] = React.useState(false)

    const selectComponent = (activeMenuItem) => {
        switch (activeMenuItem) {
            case  "Home":
                return {view: <Home setDatasetsActive={setDatasetsActive}/>}
            case  "Database":
                return {view: <SelectDatabase setDatasetsActive={setDatasetsActive}/>}
            case "Recipes":
                return {header: "Recipes", view: <Recipe/>}
            default:
                return {view: <MainContent onComplete={onComplete}/>}
        }
    }

    const {view} = selectComponent(activeMenuItem)

    const page = activeAlgorithm ? `${constants.version}/${activeGroup}/${activeAlgorithm}` : `${constants.version}/${activeGroup}`

    return (
        <Container fluid style={{height: '100%', display: "flex", flexFlow: "column", background: "#fff"}}>
            <AlgorithmsGroupMenu setAboutActive={setAboutActive} setDatasetsActive={setDatasetsActive}/>
            <div style={{width: '100%', overflowY: 'auto', flexGrow: "1"}}>
                {view}
                <FeedbackForm page={page}/>
                <About open={aboutActive} onClose={() => setAboutActive(false)}/>
                <Datasets onComplete={onComplete} open={datasetsActive} onClose={() => setDatasetsActive(false)}/>
            </div>
        </Container>
    )
}

const mapStateToProps = state => ({
    activeMenuItem: state.menu.item,
    limit: state.settings.limit,
    communityNodeLimit: state.settings.communityNodeLimit,
})

const mapDispatchToProps = dispatch => ({
    updateLimit: value => dispatch(limit(value)),
    setLabels: labels => dispatch(setLabels(labels)),
    setRelationshipTypes: relationshipTypes => dispatch(setRelationshipTypes(relationshipTypes)),
    setPropertyKeys: propertyKeys => dispatch(setPropertyKeys(propertyKeys))
})

export default connect(mapStateToProps, mapDispatchToProps)(NEuler)
