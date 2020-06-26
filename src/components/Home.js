import {
  Button,
  Card,
  CardGroup,
  Checkbox,
  Container,
  Divider,
  Dropdown,
  Form,
  Header,
  Icon,
  TextArea
} from "semantic-ui-react"
import React, {Component, useState} from 'react'

import {selectGroup} from "../ducks/algorithms"
import {connect} from "react-redux";
import {setActiveDatabase, setDatabases, setLabels, setPropertyKeys, setRelationshipTypes} from "../ducks/metadata";
import {getDriver, hasNamedDatabase, onActiveDatabase} from "../services/stores/neoStore";
import {loadMetadata} from "../services/metadata";
import {FeedbackForm} from "./Feedback/FeedbackForm";

class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            serverInfo: ""
        }
    }

    onRefresh() {
        loadMetadata(this.props.metadata.versions.neo4jVersion).then(metadata => {
            this.props.setLabels(metadata.labels)
            this.props.setRelationshipTypes(metadata.relationships)
            this.props.setPropertyKeys(metadata.propertyKeys)
            this.props.setDatabases(metadata.databases)
        })
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
                    <Header as={"h3"}>
                        Use Database
                    </Header>

                    <div>
                        <p>
                            Connected to: {this.state.serverInfo.address}

                        </p>

                            <Button as='div' labelPosition='left'>
                            <Dropdown value={metadata.activeDatabase} placeholder='Database' fluid search selection style={{"width": "290px"}}
                                      options={databaseOptions} onChange={(evt, data) => {
                                setActiveDatabase(data.value);
                                onActiveDatabase(data.value);
                                this.onRefresh()
                            }}/>

                              {hasNamedDatabase() ? <Button icon style={{marginLeft: "10px"}} onClick={this.onRefresh.bind(this)}>
                                <Icon className="refresh" size="large"  />
                            </Button> : null}
                            </Button>



                    </div>

                    <Divider />

                    <Header as={"h3"}>
                        Algorithm Categories
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
    metadata: state.metadata
})

const mapDispatchToProps = dispatch => ({
    selectGroup: group => dispatch(selectGroup(group)),
    setActiveDatabase: database => dispatch(setActiveDatabase(database)),
    setDatabases: databases => dispatch(setDatabases(databases)),
    setLabels: labels => dispatch(setLabels(labels)),
    setRelationshipTypes: relationshipTypes => dispatch(setRelationshipTypes(relationshipTypes)),
    setPropertyKeys: propertyKeys => dispatch(setPropertyKeys(propertyKeys))
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
