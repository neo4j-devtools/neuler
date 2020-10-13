import {
    Button,
    Card,
    CardGroup,
    Container,
    Divider,
    Dropdown,
    List,
    Header,
    Icon,
    Loader,
    Message
} from "semantic-ui-react"
import React from 'react'

import {selectGroup} from "../ducks/algorithms"
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
import {addDatabase, initLabel} from "../ducks/settings";
import WhatIsMissing from "./Onboarding/WhatIsMissing";
import SelectedDatabase from "./Onboarding/SelectedDatabase";
import {updateMetadata} from "./Startup/startup";
import {OpenCloseSection} from "./Form/OpenCloseSection";


const Home = (props) => {
    const {selectGroup, metadata} = props
    const credentials = props.connectionInfo.credentials


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
                </OpenCloseSection>


                <OpenCloseSection title="Getting Started">


                <p>
                    The Neo4j Graph Data Science Library supports the following categories of algorithms.
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
                                <Button basic color='green' onClick={() => selectGroup('Centralities')}>
                                    Select
                                </Button>
                            </div>
                        </Card.Content>
                    </Card>

                    <Card key={"communityDetection"}>
                        <Card.Content>
                            <Icon name='sitemap'/>
                            <Card.Header>
                                Community Detection
                            </Card.Header>
                            <Card.Meta>
                                These algorithms evaluate how a group is clustered or partitioned, as
                                well as its tendency to strengthen or break apart
                            </Card.Meta>
                        </Card.Content>
                        <Card.Content extra>
                            <div className='ui two buttons'>
                                <Button basic color='green' onClick={() => selectGroup('Community Detection')}>
                                    Select
                                </Button>
                            </div>
                        </Card.Content>
                    </Card>

                    <Card key={"pathFinding"}>
                        <Card.Content>
                            <Icon name='sitemap'/>
                            <Card.Header>
                                Path Finding
                            </Card.Header>
                            <Card.Meta>
                                These algorithms help find the shortest path or evaluate the availability and quality of
                                routes
                            </Card.Meta>
                        </Card.Content>
                        <Card.Content extra>
                            <div className='ui two buttons'>
                                <Button basic color='green' onClick={() => selectGroup("Path Finding")}>
                                    Select
                                </Button>
                            </div>
                        </Card.Content>
                    </Card>

                    <Card key={"similarity"}>
                        <Card.Content>
                            <Icon name='sitemap'/>
                            <Card.Header>
                                Similarity
                            </Card.Header>
                            <Card.Meta>
                                These algorithms help calculate the similarity of nodes.
                            </Card.Meta>
                        </Card.Content>
                        <Card.Content extra>
                            <div className='ui two buttons'>
                                <Button basic color='green' onClick={() => selectGroup("Similarity")}>
                                    Select
                                </Button>
                            </div>
                        </Card.Content>
                    </Card>

                </CardGroup>
                </OpenCloseSection>

            </Container>

        </div>
        </React.Fragment>
    )

}


const mapStateToProps = state => ({
    activeGroup: state.algorithms.group,
    metadata: state.metadata,
    labels: state.settings.labels,
    connectionInfo: state.connections,
})

const mapDispatchToProps = dispatch => ({
    selectGroup: group => dispatch(selectGroup(group)),
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
