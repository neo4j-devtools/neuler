import {Button, Card, CardGroup, Icon} from "semantic-ui-react"
import React, {Component} from 'react'
import {runCypher} from "../services/stores/neoStore"


class Datasets extends Component {
    render() {
        const containerStyle = {
            "marginLeft": "10px"
        }

        const handleException = error => {
            console.error(error)
            throw new Error(error)
        }


        const datasets = [
            {
                name: "Game of Thrones",
                description: "Got dataset",
                loadData: () => {

                    let constraintsQuery = `CREATE CONSTRAINT ON (c:Character) ASSERT c.id IS UNIQUE`;
                    let charactersQuery = `
                    UNWIND range(1,7) AS season
                    LOAD CSV WITH HEADERS FROM "https://github.com/mneedham/gameofthrones/raw/master/data/got-s" + season + "-nodes.csv" AS row
                    MERGE (c:Character {id: row.Id})
                    ON CREATE SET c.name = row.Label;`;
                    let interactionsQuery = `
                    UNWIND range(1,7) AS season
                    LOAD CSV WITH HEADERS FROM "https://github.com/mneedham/gameofthrones/raw/master/data/got-s" + season + "-edges.csv" AS row
                    MATCH (source:Character {id: row.Source})
                    MATCH (target:Character {id: row.Target})
                    CALL apoc.merge.relationship(source, "INTERACTS_SEASON" + season, {}, {}, target) YIELD rel
                    SET rel.weight = toInteger(row.Weight)`;

                    runCypher(constraintsQuery).then(() => runCypher(charactersQuery).then(() => runCypher(interactionsQuery))).catch(handleException)
                }
            },
        ]

        return (<div style={containerStyle}><CardGroup>
                    {datasets.map(dataset => (
                        <Card key={dataset.name}>
                            <Card.Content>
                                <Icon name='sitemap'/>
                                <Card.Header>
                                    {dataset.name}
                                </Card.Header>
                                <Card.Meta>
                                    {dataset.description}
                                </Card.Meta>
                            </Card.Content>
                            <Card.Content extra>
                                <div className='ui two buttons'>
                                    <Button basic color='green' onClick={dataset.loadData.bind(this)}>
                                        Load
                                    </Button>
                                </div>
                            </Card.Content>
                        </Card>
                    ))}

            </CardGroup></div>
        )

    }
}

export default Datasets
