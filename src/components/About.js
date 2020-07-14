import {Container, Message} from "semantic-ui-react"
import React, {Component} from 'react'
import {connect} from "react-redux";

export const NEULER_VERSION = "0.1.25"

class About extends Component {
    render() {
        const containerStyle = {
            margin: "1em",
        }

        return (<div style={containerStyle}>
                <Container fluid>
                    <h3>Versions</h3>
                    <Message>

                        <p>
                            NEuler: <strong>{NEULER_VERSION}</strong>
                        </p>

                        <p>
                            Graph Data Science Library: <strong>{this.props.metadata.versions.gdsVersion}</strong>
                        </p>

                        <p>
                            Neo4j Server: <strong>{this.props.metadata.versions.neo4jVersion}</strong>
                        </p>


                    </Message>

                </Container>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    metadata: state.metadata
})


export default connect(mapStateToProps)(About)
