import {
    Button,
    Card,
    CardGroup,
    Container,
    Divider,
    Dropdown,
    List,
    Header,
    Icon, Image,
    Loader,
    Message
} from "semantic-ui-react"
import React from 'react'

import {connect} from "react-redux";
import {
    setActiveDatabase,
    setDatabases,
    setLabels,
    setNodePropertyKeys,
    setPropertyKeys,
    setRelationshipTypes
} from "../ducks/metadata";
import {getActiveDatabase, hasNamedDatabase, onActiveDatabase} from "../services/stores/neoStore";
import {loadMetadata} from "../services/metadata";
import {addDatabase, initLabel} from "../ducks/metadata";
import WhatIsMissing from "./Onboarding/WhatIsMissing";
import SelectedDatabase from "./Onboarding/SelectedDatabase";
import {updateMetadata} from "./Startup/startup";
import {OpenCloseSection} from "./Form/OpenCloseSection";
import {useHistory} from "react-router-dom";
import {getAlgorithmDefinitions} from "./algorithmsLibrary";
import {hasNodesAndRelationships} from "./SelectDatabase";
import {publicPathTo} from "./AlgorithmGroupsMenu";



const Home = (props) => {
    const {metadata} = props
    const credentials = props.connectionInfo.credentials
    const history = useHistory();

    const addLimits = (params) => {
        return {
            ...params,
            limit: props.limit,
            communityNodeLimit: props.communityNodeLimit
        }
    }

    const generateAlgorithmState = (group, algorithm) => {
        const {parameters, parametersBuilder} = getAlgorithmDefinitions(group, algorithm, props.metadata.versions.gdsVersion)
        const params = parametersBuilder({
            ...parameters,
            requiredProperties: Object.keys(parameters)
        })

        const formParameters = addLimits(parameters);
        return {
            group: group,
            algorithm: algorithm,
            newParameters: params,
            formParameters: formParameters
        }
    }

    const getDescription = (group, algorithm) => {
        const {description} = getAlgorithmDefinitions(group, algorithm, props.metadata.versions.gdsVersion)
        return description
    }



    return (<React.Fragment>
            <div className="page-heading">
        Welcome to NEuler - The Graph Data Science Playground
    </div>
            <div className="top-level-container">

            <Container fluid>

                <OpenCloseSection title="Database Connection">
                    <List className="connection">
                        <List.Item className="connection-item">
                            <label>Username</label>
                            <span>{credentials.username}</span>
                        </List.Item>
                        <List.Item className="connection-item">
                            <label>Server</label>
                            <span>{credentials.host}</span>
                        </List.Item>
                        <List.Item className="connection-item">
                            <label>Database</label>
                            <span>{metadata.activeDatabase}</span>
                        </List.Item>
                    </List>
                    <Button onClick={() => {
                        history.push({
                            pathname: '/database'
                        })
                    }}>
                        Configure Database
                    </Button>
                </OpenCloseSection>


                <OpenCloseSection title="Getting Started" className="getting-started">

                    {!hasNodesAndRelationships(props.metadata) && <WhatIsMissing setDatasetsActive={props.setDatasetsActive}/>}

                    {hasNodesAndRelationships(props.metadata) && <React.Fragment>
                <p className="intro">
                    NEuler supports running graph algorithms in two ways:
                </p>

                <CardGroup>
                    <Card key={"run-algorithm"}>
                        <Card.Content>
                            <Image src={publicPathTo("images/noun_algorithm_563285.png")} />
                            <Card.Header>
                                Run single algorithm
                            </Card.Header>
                            <Card.Meta>
                                Choose this option if you want to choose from any of the available algorithms in the Graph Data Science Library.
                            </Card.Meta>
                        </Card.Content>
                        <Card.Content extra>
                            <div className='ui two buttons'>
                                <Button basic color='green' onClick={() => {
                                    history.push({
                                        pathname: '/algorithms/new',
                                        state: generateAlgorithmState("Centralities", "Degree")
                                    })
                                }}>
                                    Select
                                </Button>
                            </div>
                        </Card.Content>
                    </Card>

                    <Card key={"run-algorithm-recipe"}>
                        <Card.Content>
                            <Image src={publicPathTo("images/noun_recipes_1566765.png")} />
                            <Card.Header>
                                Run Algorithm Recipe
                            </Card.Header>
                            <Card.Meta>
                                Choose this option if you aren't sure which algorithm to run and would like to suggestions of commonly used combinations of algorithms.
                            </Card.Meta>
                        </Card.Content>
                        <Card.Content extra>
                            <div className='ui two buttons'>
                                <Button basic color='green' onClick={() => {
                                    history.push({
                                        pathname: '/recipes'
                                    })
                                }}>
                                    Select
                                </Button>
                            </div>
                        </Card.Content>
                    </Card>

                </CardGroup>
                    </React.Fragment>}
                </OpenCloseSection>

            </Container>

        </div>
        </React.Fragment>
    )

}


const mapStateToProps = state => ({
    activeGroup: state.algorithms.group,
    metadata: state.metadata,
    labels: state.metadata.allLabels,
    connectionInfo: state.connections,
    limit: state.settings.limit,
    communityNodeLimit: state.settings.communityNodeLimit,
})

const mapDispatchToProps = dispatch => ({
    setActiveDatabase: database => dispatch(setActiveDatabase(database)),
    setDatabases: databases => dispatch(setDatabases(databases)),
    setLabels: labels => dispatch(setLabels(labels)),
    setRelationshipTypes: relationshipTypes => dispatch(setRelationshipTypes(relationshipTypes)),
    setPropertyKeys: propertyKeys => dispatch(setPropertyKeys(propertyKeys)),
    setNodePropertyKeys: propertyKeys => dispatch(setNodePropertyKeys(propertyKeys)),
    addDatabase: database => dispatch(addDatabase(database)),
    initLabel: (database, label, color, propertyKeys) => dispatch(initLabel(database, label, color, propertyKeys))
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
