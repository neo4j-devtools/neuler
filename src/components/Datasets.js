import {
    Button,
    Card,
    CardGroup,
    Container,
    Dimmer,
    Header,
    Icon,
    Loader,
    Message,
    Modal,
    Segment
} from "semantic-ui-react"
import React, {Component} from 'react'
import {runCypher} from "../services/stores/neoStore"
import {connect} from "react-redux";
import {sendMetrics} from "./metrics/sendMetrics";
import Clipboard from "react-clipboard.js";


class Datasets extends Component {
    state = {
        open: false,
        selectedDataset: null,
        currentQueryIndex: -1,
        completedQueryIndexes: {},
        completed: [],
        loadSampleGraphCollapsed: false,
        runAlgorithmsCollapsed: true
    }

    resetState() {
        this.setState({
            open: false,
            currentQueryIndex: -1,
            completedQueryIndexes: {},
        })
    }

    show = (dimmer, datasetName) => () => this.setState({
        currentQueryIndex: -1,
        completedQueryIndexes: {},
        completed: [],
        selectedDataset: datasetName,
        loadSampleGraphCollapsed: false,
        runAlgorithmsCollapsed: true
    })
    close = () => this.resetState()

    loadDataset() {
        const { selectedDataset } = this.state

        const queries = sampleGraphs[selectedDataset].queries;
        queries.reduce((promiseChain, query, qIndex) => {
            return promiseChain.then(chainResults => {
                  this.setState({ currentQueryIndex: qIndex })
                  return runCypher(query)
                  .catch(error => {if (error.code !== "Neo.ClientError.Schema.EquivalentSchemaRuleAlreadyExists") throw new Error(error)})
                  .then(currentResult => {
                      this.setState({
                          completedQueryIndexes: { ...this.state.completedQueryIndexes, [qIndex]: true }
                      })
                      return [...chainResults, currentResult]
                  })
              }
            );
        }, Promise.resolve([]))
          .then(results => {
              const {completed} = this.state
              completed.push(selectedDataset)
              this.setState({
                  currentQueryIndex: -1,
                  completed: completed,
                  runAlgorithmsCollapsed: false
              })

              sendMetrics('neuler-loaded-dataset', selectedDataset )

              this.props.onComplete()
          })
    }

    render() {
        const containerStyle = {
            margin: "1em",
        }

        const { selectedDataset, currentQueryIndex, completedQueryIndexes, completed, loadSampleGraphCollapsed, runAlgorithmsCollapsed } = this.state
        const selectedStyle = {background: "#e5f9e7"};

        const minimiseIcon = "minus"
        const maximiseIcon = "plus"

        let toggleIcon = 'minus'

        const collapsed = true

        if (collapsed) {
            // containerStyle.height = '15em';
            toggleIcon = 'plus'
        }

        const buttonStyle = { borderRadius: '0', background: "white", float: "right", height: "23px", width: "23px" };


        return (<div style={containerStyle}>
                <Container fluid>
                    <p>
                        Below are some sample graphs that are useful for learning how to use the Graph Data Science library.
                    </p>

                    <CardGroup>
                        {Object.keys(sampleGraphs).map(key => {

                            return (
                                <Card key={sampleGraphs[key].name} raised={sampleGraphs[key].name === selectedDataset}>
                                    <Card.Content
                                        style={sampleGraphs[key].name === selectedDataset ? selectedStyle : null}>
                                        <Icon name='sitemap'/>
                                        <Card.Header>
                                            {sampleGraphs[key].name}
                                        </Card.Header>
                                        <Card.Meta>
                                            Author: <a target="_blank" rel="noopener noreferrer"
                                                       href={sampleGraphs[key].authorLink}>{sampleGraphs[key].author}</a>
                                        </Card.Meta>
                                        <Card.Description>
                                            {sampleGraphs[key].description}
                                        </Card.Description>
                                    </Card.Content>
                                    <Card.Content extra
                                                  style={sampleGraphs[key].name === selectedDataset ? selectedStyle : null}>
                                        <div className='ui two buttons'>
                                            <Button basic color='green'
                                                    onClick={this.show(true, sampleGraphs[key].name)}>
                                                Select
                                            </Button>
                                        </div>
                                    </Card.Content>
                                </Card>
                            );
                        })}

                    </CardGroup>

                    {selectedDataset ?
                    <Card fluid>
                        <Card.Content >
                            <Card.Header>
                                Load Sample Graph
                                <Button style={buttonStyle} icon size='medium'
                                        onClick={() => this.setState(({ loadSampleGraphCollapsed }) => ({ loadSampleGraphCollapsed: !loadSampleGraphCollapsed }))}>
                                    <Icon name={loadSampleGraphCollapsed ? "plus" : "minus"} style={{}} />
                                </Button>
                            </Card.Header>
                        </Card.Content>
                        <Card.Content style={loadSampleGraphCollapsed? {display: "none"} : null}>
                            <Card.Description>
                                <Message color='purple'>
                                    <Message.Header>
                                        Do you want to load the sample graph?
                                    </Message.Header>
                                    <Message.Content>
                                        <p>Pressing the 'Yes, load it!' button below will run the following Cypher
                                            statements:</p>
                                    </Message.Content>
                                </Message>

                                <div>
                                    {sampleGraphs[selectedDataset].queries.map((query, queryIndex) => (
                                      <Message key={queryIndex}>
                                          {completedQueryIndexes[queryIndex] ? <Icon color='green' name='check'/> : null}
                                          <pre style={{ whiteSpace: 'pre-wrap' }}>{query};</pre>
                                          <Clipboard onSuccess={(event) => {
                                              sendMetrics('neuler-sample-graphs', "copied-code", {type: "sample-graph-query", graph: selectedDataset})
                                              event.trigger.textContent = "Copied";
                                              setTimeout(() => {
                                                  event.trigger.textContent = 'Copy';
                                              }, 2000);
                                          }}
                                                     button-className="code"
                                                     data-clipboard-text={query}>
                                              Copy
                                          </Clipboard>
                                          <Dimmer active={queryIndex === currentQueryIndex}>
                                              <Loader>Running</Loader>
                                          </Dimmer>

                                      </Message>

                                    ))}

                                </div>

                                {completed.includes(selectedDataset)
                                    ? null
                                    : <div style={{padding: "12px 0 0 0"}}>
                                        <Button
                                            disabled={currentQueryIndex >= 0}
                                            positive
                                            color='green'
                                            content="Yes, load it!"
                                            onClick={this.loadDataset.bind(this)}
                                        />

                                    </div>
                                }
                            </Card.Description>
                        </Card.Content>
                        <Card.Content>
                            <Card.Header>
                                Run Graph Algorithms
                                <Button style={buttonStyle} icon size='medium'
                                        onClick={() => this.setState(({ runAlgorithmsCollapsed }) => ({ runAlgorithmsCollapsed: !runAlgorithmsCollapsed }))}>
                                    <Icon name={runAlgorithmsCollapsed ? "plus" : "minus"} style={{}}/>
                                </Button>
                            </Card.Header>
                        </Card.Content>
                        <Card.Content style={runAlgorithmsCollapsed? {display: "none"} : null}>
                            <Card.Description>
                                <p>The following algorithms are well suited to the {selectedDataset} sample graph:</p>
                            </Card.Description>
                        </Card.Content>
                    </Card> : null}

                </Container>
            </div>
        )

    }
}

const sampleGraphs = {
    "Game of Thrones": {
        name: "Game of Thrones",
        author: "Andrew Beveridge",
        authorLink: "https://networkofthrones.wordpress.com/",
        description: `A dataset containing interactions between the characters across the first 7 seasons of the popular TV show.`,
        queries: [
            `CREATE CONSTRAINT ON (c:Character) ASSERT c.id IS UNIQUE`,
            `UNWIND range(1,7) AS season
LOAD CSV WITH HEADERS FROM "https://github.com/neo4j-apps/neuler/raw/master/sample-data/got/got-s" + season + "-nodes.csv" AS row
MERGE (c:Character {id: row.Id})
ON CREATE SET c.name = row.Label`,
            `UNWIND range(1,7) AS season
LOAD CSV WITH HEADERS FROM "https://github.com/neo4j-apps/neuler/raw/master/sample-data/got/got-s" + season + "-edges.csv" AS row
MATCH (source:Character {id: row.Source})
MATCH (target:Character {id: row.Target})
CALL apoc.merge.relationship(source, "INTERACTS_SEASON" + season, {}, {}, target) YIELD rel
SET rel.weight = toInteger(row.Weight)`
        ]
    },

    "European Roads": {
        name: "European Roads",
        author: "Lasse Westh-Nielsen",
        authorLink: "http://lassewesth.blogspot.com/2018/07/the-international-e-road-network-and.html",
        description: `A dataset containing European Roads.`,
        queries: [
            `CREATE CONSTRAINT ON (p:Place) ASSERT p.name IS UNIQUE`,
            `USING PERIODIC COMMIT 1000
LOAD CSV WITH HEADERS FROM "https://github.com/neo4j-apps/neuler/raw/master/sample-data/eroads/roads.csv"
AS row

MERGE (origin:Place {name: row.origin_reference_place})
SET origin.countryCode = row.origin_country_code

MERGE (destination:Place {name: row.destination_reference_place})
SET destination.countryCode = row.destination_country_code

MERGE (origin)-[eroad:EROAD {road_number: row.road_number}]->(destination)
SET eroad.distance = toInteger(row.distance), eroad.watercrossing = row.watercrossing`
        ]
    },
    "Twitter": {
        name: "Twitter",
        author: "Mark Needham",
        authorLink: "https://markhneedham.com/blog/",
        description: `A dataset containing Twitter followers of the graph community`,
        queries: [ `CREATE CONSTRAINT ON(u:User) ASSERT u.id IS unique`,
            `CALL apoc.load.json("https://github.com/neo4j-apps/neuler/raw/master/sample-data/twitter/users.json")
YIELD value
MERGE (u:User {id: value.user.id })
SET u += value.user
FOREACH (following IN value.following |
  MERGE (f1:User {id: following})
  MERGE (u)-[:FOLLOWS]->(f1))
FOREACH (follower IN value.followers |
  MERGE(f2:User {id: follower})
  MERGE (u)<-[:FOLLOWS]-(f2));`
        ]
    },

    "Recipes": {
        name: "Recipes",
        author: "DBpedia",
        authorLink: "https://wiki.dbpedia.org/",
        description: `A dataset containing recipes and their ingredients.`,
        queries: [
            `CREATE CONSTRAINT ON (r:Recipe) ASSERT r.name IS UNIQUE`,
            `CREATE CONSTRAINT ON (i:Ingredient) ASSERT i.name IS UNIQUE`,
            `USING PERIODIC COMMIT 1000
LOAD CSV WITH HEADERS FROM "https://github.com/neo4j-apps/neuler/raw/master/sample-data/recipes/recipes.csv"
AS row
MERGE (r:Recipe{name:row.recipe})
WITH r,row.ingredients as ingredients
UNWIND split(ingredients,',') as ingredient
MERGE (i:Ingredient{name:ingredient})
MERGE (r)-[:CONTAINS_INGREDIENT]->(i)`
        ]
    }

}

const mapStateToProps = state => ({
    metadata: state.metadata
})


export default connect(mapStateToProps)(Datasets)
