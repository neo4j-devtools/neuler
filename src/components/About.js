import {
    Button,
    Card,
    CardGroup,
    Icon,
    Container,
    Header,
    Modal,
    Loader,
    Segment,
    Dimmer,
    Message
} from "semantic-ui-react"
import React, {Component} from 'react'
import {runCypher} from "../services/stores/neoStore"
import {getCurrentAlgorithm} from "../ducks/algorithms";
import {limit} from "../ducks/settings";
import {addTask} from "../ducks/tasks";
import {connect} from "react-redux";


class About extends Component {
    render() {
        const containerStyle = {
            margin: "1em",
        }

        console.log(this.props.metadata)


        return (<div style={containerStyle}>
                <Container fluid>
                    <Message>
                        <h3>You are running</h3>

                        <p>
                            Neo4j Server version:
                        </p>

                        <p>
                            Graph Data Science Library version: <strong>{this.props.metadata.gdsVersion}</strong>
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
