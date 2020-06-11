import {Container, Message} from "semantic-ui-react"
import React, {Component} from 'react'
import {connect} from "react-redux";

class About extends Component {
    render() {
        const containerStyle = {
            margin: "1em",
        }

        const version = "0.1.20"

        console.log(this.props.metadata)


        return (<div style={containerStyle}>
                <Container fluid>
                    <h3>Versions</h3>
                    <Message>


                        <p>
                            NEuler: <strong>{version}</strong>
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
