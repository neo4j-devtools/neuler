import React from 'react'
import {Button, Card, CardGroup, Container, Header, Icon, List, Menu, Segment} from "semantic-ui-react"

import AlgorithmsGroupMenu from "./AlgorithmGroupsMenu"
import {getAlgorithmDefinitions, getAlgorithms} from "./algorithmsLibrary"
import MainContent from './MainContent'
import Datasets from './Datasets'
import {connect} from "react-redux"
import {communityNodeLimit, limit} from "../ducks/settings"
import {setLabels, setPropertyKeys, setRelationshipTypes} from "../ducks/metadata"
import Home from "./Home";
import About from "./About";
import {FeedbackForm} from "./Feedback/FeedbackForm";
import {refreshMetadata} from "./Startup/startup";
import constants from "../constants.js";
import {AlgoFormView} from "./AlgorithmForm";
import {TableView} from "./Results/TableView";
import CodeView from "./CodeView";
import {ChartView} from "./Results/ChartView";
import {v4 as generateTaskId} from "uuid";
import {getActiveDatabase} from "../services/stores/neoStore";
import {ADDED} from "../ducks/tasks";
import SelectDatabase from "./SelectDatabase";
import {OpenCloseSection} from "./Form/OpenCloseSection";
import {selectAlgorithm, selectGroup} from "../ducks/algorithms";

const NEuler = (props) => {
    const {activeGroup, activeAlgorithm, selectAlgorithm} = props
    const onComplete = () => {
        refreshMetadata(props)
    }

    const [aboutActive, setAboutActive] = React.useState(false)
    const [datasetsActive, setDatasetsActive] = React.useState(false)

    const selectComponent = (activeGroup) => {
        switch (activeGroup) {
            // case "About":
            //     return {header: "About", view: <About/>}
            // case "Sample Graphs":
            //     return {header: "Sample Graphs", view: <Datasets onComplete={onComplete}/>}
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

    const {view} = selectComponent(activeGroup)

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

const RecipeView = (props) => {
    const panelRef = React.createRef()
    const [activeItem, setActiveItem] = React.useState("Configure")

    const addLimits = (params) => {
        return {
            ...params,
            limit: props.limit,
            communityNodeLimit: props.communityNodeLimit
        }
    }

    const { parameters } = getAlgorithmDefinitions("Centralities", "Degree", props.metadata.versions.gdsVersion)
    const formParameters = addLimits(parameters);
    const taskId = generateTaskId()
    const task = {
        group : "Centralities",
        algorithm: "Degree",
        status: ADDED,
        taskId,
        parameters,
        formParameters,
        persisted: false,
        startTime: new Date(),
        database: getActiveDatabase()
    }

    const activeGroup = task.group

    const containerStyle = {
        padding: '1em'
    }
    const getStyle = name => name === activeItem ? {display: ''} : {display: 'none'}

    return  <div style={containerStyle}><Container fluid>
        <OpenCloseSection title="Algorithm Recipes">
            <p>
                Algorithm Recipes are collections of algorithms that provide provide useful insights on certain types of graphs or series of algorithms that can be combined to solve a data science problem.
            </p>

            <CardGroup>
                <Card key={"centralities"}>
                    <Card.Content>
                        <Icon name='sitemap'/>
                        <Card.Header>
                            Centralities
                        </Card.Header>
                        <Card.Meta>
                            These algorithms determine the importance of distinct nodes in a network
                        </Card.Meta>
                    </Card.Content>
                    <Card.Content extra>
                        <div className='ui two buttons'>
                            <Button basic color='green' onClick={() => props.selectAlgorithm('Centralities')}>
                                Select
                            </Button>
                        </div>
                    </Card.Content>
                </Card>
            </CardGroup>

        </OpenCloseSection>
    </Container></div>

    // return <div style={{padding: "10px"}}>
    //     <h3>Some recipes</h3>
    //
    //     <div ref={panelRef}>
    //
    //             <div style={getStyle("Configure")}>
    //                 <AlgoForm
    //                     task={task}
    //                     limit={props.limit}
    //                     onRun={(newParameters, formParameters, persisted) => {
    //                         props.onRunAlgo(task, newParameters, formParameters, persisted)
    //                     }}
    //                     onCopy={(group, algorithm, newParameters, formParameters) => {
    //                         props.onCopyAlgo(group, algorithm, newParameters, formParameters)
    //                     }}
    //                 />
    //             </div>
    //
    //
    //             <div style={getStyle('Table')}>
    //                 <TableView task={task} gdsVersion={props.metadata.versions.gdsVersion}/>
    //             </div>
    //
    //             <div style={getStyle('Code')}>
    //                 <CodeView task={task}/>
    //             </div>
    //
    //             {/*{!(activeGroup === 'Path Finding' || activeGroup === 'Similarity') ?*/}
    //             {/*    <div style={getStyle('Visualisation')}>*/}
    //             {/*        <VisView task={task} active={activeItem === 'Visualisation'}/>*/}
    //             {/*    </div> : null}*/}
    //
    //             {activeGroup === 'Centralities' ?
    //                 <div style={getStyle('Chart')}>
    //                     <ChartView task={task} active={activeItem === 'Chart'}/>
    //                 </div> : null}
    //
    //
    //     </div>
    //
    //
    // </div>
}

const AlgoForm = connect(state => ({
    activeGroup: "Centralities",
    activeAlgorithm: "Degree",
    currentAlgorithm: getAlgorithmDefinitions("Centralities", "Degree", state.metadata.versions.gdsVersion),
    metadata: state.metadata,
    limit: state.settings.limit,
    communityNodeLimit: state.settings.communityNodeLimit,
}), dispatch => ({

    updateLimit: value => dispatch(limit(value)),
    updateCommunityNodeLimit: value => dispatch(communityNodeLimit(value)),
}))(AlgoFormView)


const Recipe = connect(state => ({
    metadata: state.metadata,
}), dispatch => ({
    selectAlgorithm: group => dispatch(selectAlgorithm(group)),
}))(RecipeView)

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
