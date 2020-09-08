import {Container, Table} from "semantic-ui-react"
import React, {Component} from 'react'
import {connect} from "react-redux";

export const NEULER_VERSION = "0.1.32"

class About extends Component {
    render() {
        const containerStyle = {
            margin: "1em",
        }

        return (<div style={containerStyle}>
                <Container fluid>
                    <h2>Versions</h2>

                    <Table basic='very' celled collapsing>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>
                                    Component
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    Version
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>NEuler</Table.Cell>
                                <Table.Cell>
                                    {NEULER_VERSION}
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell >Graph Data Science Library</Table.Cell>
                                <Table.Cell>{this.props.metadata.versions.gdsVersion}
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell >Neo4j Server</Table.Cell>
                                <Table.Cell>{this.props.metadata.versions.neo4jVersion}
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>

                </Container>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    metadata: state.metadata
})


export default connect(mapStateToProps)(About)
