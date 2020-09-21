import {Container, Modal, Table} from "semantic-ui-react"
import React from 'react'
import {connect} from "react-redux";
import constants from "../constants.js";

const About = (props) => {
    const containerStyle = {
        margin: "1em",
    }

    return <Modal open={props.open}
                  onClose={props.onClose}
                  centered={false}
                  closeIcon
                  size="small">
        <Modal.Header>
            Versions
        </Modal.Header>
        <Modal.Content>
            <div style={containerStyle}>
                <Container fluid>
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
                                    {constants.version}
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>Graph Data Science Library</Table.Cell>
                                <Table.Cell>{props.metadata.versions.gdsVersion}
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>Neo4j Server</Table.Cell>
                                <Table.Cell>{props.metadata.versions.neo4jVersion}
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>

                </Container>
            </div>

        </Modal.Content>
    </Modal>

}

const mapStateToProps = state => ({
    metadata: state.metadata
})


export default connect(mapStateToProps)(About)
