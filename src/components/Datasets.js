import {Button, Card, CardGroup, Container, Dimmer, Icon, Loader, Message} from "semantic-ui-react"
import React, {Component} from 'react'
import {runCypher} from "../services/stores/neoStore"
import {connect} from "react-redux";
import {sendMetrics} from "./metrics/sendMetrics";
import Clipboard from "react-clipboard.js";
import {selectAlgorithm, selectGroup} from "../ducks/algorithms";
import {sampleGraphs} from "./SampleGraphs/sampleGraphs";


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
        const { selectGroup, selectAlgorithm } = this.props
        const selectedStyle = {background: "#e5f9e7"};
        const buttonStyle = { borderRadius: '0', background: "white", float: "right", height: "23px", width: "23px" };

        const headerStyle = {cursor: "pointer", background: "#f8f8f9"};
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
                        <Card.Content  style={headerStyle} onClick={() => this.setState(({ loadSampleGraphCollapsed }) => ({ loadSampleGraphCollapsed: !loadSampleGraphCollapsed }))}>
                            <Card.Header>
                                Load Sample Graph
                                <Icon style={buttonStyle} name={loadSampleGraphCollapsed ? "plus" : "minus"} />
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
                        <Card.Content style={headerStyle} onClick={() => this.setState(({ runAlgorithmsCollapsed }) => ({ runAlgorithmsCollapsed: !runAlgorithmsCollapsed }))}>
                            <Card.Header  >
                                Run Graph Algorithms
                                    <Icon style={buttonStyle} name={runAlgorithmsCollapsed ? "plus" : "minus"} />

                            </Card.Header>
                        </Card.Content>
                        <Card.Content style={runAlgorithmsCollapsed? {display: "none"} : null}>
                            <Card.Description>
                                <p>The following algorithms are well suited to the {selectedDataset} sample graph:</p>

                                <CardGroup>
                                    {sampleGraphs[selectedDataset].algorithms.map(item => {
                                        return (
                                            <Card key={item.name}>
                                                <Card.Content>
                                                    <Icon name='sitemap'/>
                                                    <Card.Header>
                                                        {item.name}
                                                    </Card.Header>

                                                    <Card.Description>
                                                        {item.description}
                                                    </Card.Description>
                                                </Card.Content>
                                                <Card.Content extra>
                                                    <div className='ui two buttons'>
                                                        <Button basic color='green' onClick={() => {
                                                            sendMetrics('neuler-sample-graphs', "try-out-algorithm", {category: item.category, name: item.name});
                                                            selectGroup(item.category);
                                                            selectAlgorithm(item.name);
                                                        }}>
                                                            Try it out
                                                        </Button>
                                                    </div>
                                                </Card.Content>
                                            </Card>
                                        );
                                    })}
                                </CardGroup>


                            </Card.Description>
                        </Card.Content>
                    </Card> : null}

                </Container>
            </div>
        )

    }
}


const mapStateToProps = state => ({
    metadata: state.metadata
})

const mapDispatchToProps = dispatch => ({
    selectAlgorithm: algorithm => dispatch(selectAlgorithm(algorithm)),
    selectGroup: algorithm => dispatch(selectGroup(algorithm)),
})


export default connect(mapStateToProps, mapDispatchToProps)(Datasets)
