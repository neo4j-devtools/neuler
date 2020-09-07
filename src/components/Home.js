import {Button, Card, CardGroup, Container, Divider, Dropdown, Header, Icon, Loader, Message} from "semantic-ui-react"
import React, {Component} from 'react'

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
import {getActiveDatabase, getDriver, hasNamedDatabase, onActiveDatabase} from "../services/stores/neoStore";
import {loadMetadata} from "../services/metadata";
import {addDatabase, initLabel} from "../ducks/settings";
import {selectCaption, selectRandomColor} from "./NodeLabel";
import WhatIsMissing from "./Onboarding/WhatIsMissing";
import SelectedDatabase from "./Onboarding/SelectedDatabase";


class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            serverInfo: "",
            activeDatabaseSelected: true
        }
    }

    onRefresh() {
        this.setState({activeDatabaseSelected: false})
        loadMetadata(this.props.metadata.versions.neo4jVersion).then(metadata => {
            this.props.setLabels(metadata.labels)
            this.props.setRelationshipTypes(metadata.relationships)
            this.props.setPropertyKeys(metadata.propertyKeys)
            this.props.setNodePropertyKeys(metadata.nodePropertyKeys)
            this.props.setDatabases(metadata.databases)

            metadata.databases.forEach(database => {
                this.props.addDatabase(database.name)
            })

            metadata.labels.forEach(label => {
                this.props.initLabel(this.props.metadata.activeDatabase, label.label, selectRandomColor(), selectCaption(metadata.nodePropertyKeys[label.label]))
            })

            this.setState({activeDatabaseSelected: true})
        })
    }



    hasNodesAndRelationships(metadata) {
        return (metadata.labels.length > 0 && metadata.relationshipTypes.length > 0)
    }

    render() {
        const containerStyle = {
            padding: '1em'
        }

        const {selectGroup, setActiveDatabase, metadata} = this.props

        const databaseOptions= metadata.databases.map(value => {
            return {key: value.name, value: value.name, text: (value.name) + (value.default ? " (default)" : "")};
        })

        getDriver().verifyConnectivity().then(value => this.setState({serverInfo: value}))

        return (<div style={containerStyle}>
                <Container fluid>
                    <Header as={"h2"}>
                        Select Database
                    </Header>

                    <div>
                        <p>
                            Connected to: {this.state.serverInfo.address}
                        </p>

                        <Button as='div' labelPosition='left'>
                            <Dropdown value={metadata.activeDatabase} placeholder='Database' fluid search selection
                                      style={{"width": "290px"}}
                                      options={databaseOptions} onChange={(evt, data) => {
                                if(data.value !== getActiveDatabase()) {
                                    setActiveDatabase(data.value);
                                    onActiveDatabase(data.value);
                                    this.onRefresh()
                                }
                            }}/>
                            {hasNamedDatabase() ?
                                <Button  icon style={{marginLeft: "10px"}} onClick={ () => {
                                    this.onRefresh()
                                }}>
                                    <Icon className="refresh" size="large"/>
                                </Button> : null}
                        </Button>
                    </div>

                    <div style={{paddingTop: "10px"}}>
                        {
                            this.state.activeDatabaseSelected ?
                                (this.hasNodesAndRelationships(this.props.metadata)) ? <SelectedDatabase onRefresh={this.onRefresh.bind(this)} /> :
                                    <WhatIsMissing/>
                                : <Message>
                                    <Message.Header>Refreshing</Message.Header>
                                    <Message.Content>
                                        <Loader active inline style={{padding: "5px 0"}}/>
                                    </Message.Content>
                                </Message>

                        }

                    </div>

                    <Divider />

                    <Header as={"h2"}>
                        Getting Started
                    </Header>
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
                                    These algorithms help find the shortest path or evaluate the availability and quality of routes
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


                </Container>

          </div>

        )

    }
}



const mapStateToProps = state => ({
    activeGroup: state.algorithms.group,
    metadata: state.metadata,
    labels: state.settings.labels
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
