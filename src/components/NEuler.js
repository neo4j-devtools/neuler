import React from 'react'
import {Container, Header, Menu, Segment} from "semantic-ui-react"

import AlgorithmsGroupMenu from "./AlgorithmGroupsMenu"
import {getAlgorithms} from "./algorithmsLibrary"
import MainContent from './MainContent'
import Datasets from './Datasets'
import {connect} from "react-redux"
import {limit} from "../ducks/settings"
import {setLabels, setPropertyKeys, setRelationshipTypes} from "../ducks/metadata"
import Home from "./Home";
import About, {NEULER_VERSION} from "./About";
import {FeedbackForm} from "./Feedback/FeedbackForm";
import {refreshMetadata} from "./Startup/startup";


const NEuler = (props) => {
    const {activeGroup, activeAlgorithm, selectAlgorithm} = props
    const onComplete = () => {
        refreshMetadata(props)
    }

    const selectComponent = (activeGroup) => {
        switch (activeGroup) {
            case "About":
                return {header: "About", view: <About/>}
            case "Sample Graphs":
                return {header: "Sample Graphs", view: <Datasets onComplete={onComplete}/>}
            case  "Home":
                return {header: "Graph Data Science Playground", view: <Home/>}
            default:
                return {header: "", view: <MainContent onComplete={onComplete} />}
        }
    }

    const {header, view} = selectComponent(activeGroup)

    const page = activeAlgorithm ? `${NEULER_VERSION}/${activeGroup}/${activeAlgorithm}` : `${NEULER_VERSION}/${activeGroup}`

    return (
        <Container fluid style={{display: 'flex', height: '100%', background: "#fff"}}>
            <AlgorithmsGroupMenu/>
            <div style={{width: '100%', overflowY: 'auto'}}>
                <Segment basic inverted vertical={false}
                         style={{height: '5em', display: 'flex', justifyContent: 'space-between', marginBottom: '0'}}>
                    {header ? <Header as='h1' inverted color='grey' style={{marginTop: '0'}}>
                        {header}
                    </Header> : null}
                    <Menu inverted>
                        {getAlgorithms(activeGroup).map(algorithm =>
                            <Menu.Item key={algorithm} as='a' active={activeAlgorithm === algorithm}
                                       onClick={() => selectAlgorithm(algorithm)}>
                                {algorithm}
                            </Menu.Item>)}
                    </Menu>
                    <Header as='h1' inverted color='grey' style={{marginTop: '0'}}>
                        NEuler
                    </Header>
                </Segment>
                {view}
                <FeedbackForm page={page}/>
            </div>
        </Container>
    )

}

const mapStateToProps = state => ({
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
