import {Button, Card, CardGroup, Icon, Container, Header, Modal, Image, Segment} from "semantic-ui-react"
import React, {Component} from 'react'
import {runCypher} from "../services/stores/neoStore"


class Datasets extends Component {
    state = {open: false, selectedDataset: "Game of Thrones"}

    show = (dimmer, datasetName) => () => this.setState({dimmer, open: true, selectedDataset: datasetName})
    close = () => this.setState({open: false})

    loadDataset() {
        const {selectedDataset} = this.state
        const queries = this.getSampleGraphs()[selectedDataset].queries;
        queries.reduce((promiseChain, query) => {
            return promiseChain.then(chainResults =>
                runCypher(query).then(currentResult =>
                    [ ...chainResults, currentResult ]
                )
            );
        }, Promise.resolve([])).then(results => {
            console.log(results)
            this.close()
        });

    }

    getSampleGraphs() {
        return {
            "Game of Thrones": {
                name: "Game of Thrones",
                description: "GoT dataset",
                queries: [
                    `CREATE CONSTRAINT ON (c:Character) ASSERT c.id IS UNIQUE`,
                    `UNWIND range(1,7) AS season
                     LOAD CSV WITH HEADERS FROM "https://github.com/mneedham/gameofthrones/raw/master/data/got-s" + season + "-nodes.csv" AS row
                     MERGE (c:Character {id: row.Id})
                     ON CREATE SET c.name = row.Label`,
                    `UNWIND range(1,7) AS season
                     LOAD CSV WITH HEADERS FROM "https://github.com/mneedham/gameofthrones/raw/master/data/got-s" + season + "-edges.csv" AS row
                     MATCH (source:Character {id: row.Source})
                     MATCH (target:Character {id: row.Target})
                     CALL apoc.merge.relationship(source, "INTERACTS_SEASON" + season, {}, {}, target) YIELD rel
                     SET rel.weight = toInteger(row.Weight)`
                ]
            }
        }
    }

    render() {
        const containerStyle = {
            "marginLeft": "10px"
        }

        const {open, dimmer, selectedDataset} = this.state
        const sampleGraphs = this.getSampleGraphs()

        return (<div style={containerStyle}>
                <Container fluid>
                    <Header as='h2'>Sample Graphs</Header>
                    <p>
                        Below are some sample graphs that are useful for learning how to use the graph algorithms
                        library.
                        Note that clicking on Load will import data into your graph, so don't do this on a production
                        database.
                    </p>

                    <CardGroup>
                        {Object.keys(sampleGraphs).map(key => (
                            <Card key={sampleGraphs[key].name}>
                                <Card.Content>
                                    <Icon name='sitemap'/>
                                    <Card.Header>
                                        {sampleGraphs[key].name}
                                    </Card.Header>
                                    <Card.Meta>
                                        {sampleGraphs[key].description}
                                    </Card.Meta>
                                </Card.Content>
                                <Card.Content extra>
                                    <div className='ui two buttons'>
                                        <Button basic color='green' onClick={this.show(true, sampleGraphs[key].name)}>
                                            Load
                                        </Button>
                                    </div>
                                </Card.Content>
                            </Card>
                        ))}

                    </CardGroup>

                    <Modal dimmer={dimmer} open={open} onClose={this.close}>
                        <Modal.Header>Are you sure you want to load this sample graph?</Modal.Header>
                        <Modal.Content >
                            <Modal.Description>
                                <Header>{sampleGraphs[selectedDataset].name}</Header>
                                <p>
                                    Pressing the 'Yes, load it!' button below will run the following Cypher statements:
                                </p>
                                <p>

                                    {sampleGraphs[selectedDataset].queries.map(query => (
                                        <Segment><pre>{query}</pre></Segment>
                                    ))}

                                </p>

                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button
                                positive
                                color='green'
                                content="Yes, load it!"
                                onClick={this.loadDataset.bind(this)}
                            />
                            <Button color='black' onClick={this.close}>
                                No, get me outta here!
                            </Button>



                        </Modal.Actions>
                    </Modal>

                </Container>
            </div>
        )

    }
}

export default Datasets
