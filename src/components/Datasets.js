import {Button, Card, CardGroup, Container, Dimmer, Icon, Loader, Message, Modal} from "semantic-ui-react"
import React from 'react'
import {runCypher} from "../services/stores/neoStore"
import {connect} from "react-redux";
import {sendMetrics} from "./metrics/sendMetrics";
import Clipboard from "react-clipboard.js";
import {sampleGraphs} from "./SampleGraphs/sampleGraphs";
import {useHistory} from "react-router-dom";
import {getAlgorithmDefinitions} from "./algorithmsLibrary";

const selectedStyle = {background: "#e5f9e7"};

export const SELECT_DATASET = "select-dataset";
export const IMPORT_DATASET = "import-dataset";
export const SELECT_ALGORITHM = "select-algorithm";
export const steps = [
    SELECT_DATASET, IMPORT_DATASET, SELECT_ALGORITHM
]

const Datasets = (props) => {
    const [currentStep, setCurrentStep] = React.useState(SELECT_DATASET)
    const [selectedDataset, setSelectedDataset] = React.useState(null)
    const [currentQueryIndex, setCurrentQueryIndex] = React.useState(-1)
    const [completedQueryIndexes, setCompletedQueryIndexes] = React.useState({})
    const [completed, setCompleted] = React.useState([])
    const [nextEnabled, setNextEnabled] = React.useState(false)
    const [prevEnabled, setPrevEnabled] = React.useState(false)

    const resetState = () => {
        props.onClose()
        setCurrentQueryIndex(-1)
        setCompletedQueryIndexes({})
        setSelectedDataset(null)
        setNextEnabled(false)
        setCurrentStep(SELECT_DATASET)
    }

    const show = (dimmer, datasetName) => () => {
        setCurrentQueryIndex(-1)
        setCompletedQueryIndexes({})
        setCompleted([])
        setSelectedDataset(datasetName)
        setNextEnabled(true)
    }

    const loadDataset = () => {
        const queries = sampleGraphs[selectedDataset].queries;
        queries.reduce((promiseChain, query, qIndex) => {
            return promiseChain.then(chainResults => {
                    setCurrentQueryIndex(qIndex)
                    return runCypher(query)
                        .catch(error => {
                            if (error.code !== "Neo.ClientError.Schema.EquivalentSchemaRuleAlreadyExists") throw new Error(error)
                        })
                        .then(currentResult => {
                            // console.log("loadDataset.completedQueryIndexes", completedQueryIndexes, {...completedQueryIndexes, [qIndex]: true}, qIndex)
                            setCompletedQueryIndexes( prevState => { return {...prevState, [qIndex]: true} })

                            return [...chainResults, currentResult]
                        })
                }
            );
        }, Promise.resolve([]))
            .then(results => {
                completed.push(selectedDataset)
                setCurrentQueryIndex(-1)
                setCompleted(completed)
                setNextEnabled(true)
                props.onComplete()
                sendMetrics('neuler-loaded-dataset', selectedDataset, {dataset: selectedDataset})
            })
    }

    const containerStyle = {
        margin: "1em",
    }



    const selectScreen = (step) => {
        switch (step) {
            case SELECT_DATASET:
                return {
                    header: "Select Sample Graph",
                    view: <SelectDataset selectedDataset={selectedDataset} selectedStyle={selectedStyle} show={show} nextEnabled={nextEnabled} setNextEnabled={setNextEnabled}/>,
                    next: <Button disabled={!nextEnabled} primary
                                  onClick={() => {
                                      setCurrentStep(IMPORT_DATASET);
                                      setNextEnabled(false);
                                      setPrevEnabled(true)
                                  }}>Next <Icon name='chevron right' /></Button>
                }
            case IMPORT_DATASET:
                return {
                    header: "Import Sample Graph",
                    view: <ImportDataset selectedDataset={selectedDataset} completedQueryIndexes={completedQueryIndexes}
                                         currentQueryIndex={currentQueryIndex} completed={completed}
                                         loadDataset={loadDataset}/>,
                    previous: <Button disabled={!prevEnabled} style={{float: "left"}} primary
                                      onClick={() => {
                                          setCurrentStep(SELECT_DATASET);
                                          setPrevEnabled(false);
                                          setNextEnabled(true)
                                      }}><Icon name='chevron left' /> Previous </Button>,
                    next: <Button disabled={!nextEnabled} primary onClick={() =>
                        setCurrentStep(SELECT_ALGORITHM)
                    }>Next <Icon name='chevron right' /></Button>
                };
            case SELECT_ALGORITHM:
                return {
                    header: "Choose algorithm",
                    view: <SelectAlgorithms allDone={resetState} selectedDataset={selectedDataset}
                                             metadata={props.metadata} limit={props.limit} communityNodeLimit={props.communityNodeLimit}/>,
                    next: <Button disabled={!nextEnabled} positive onClick={resetState}>All Done</Button>
                }
            default:
                return null;
        }
    }

    const currentScreen = selectScreen(currentStep)

    return <Modal open={props.open}
                  onClose={resetState}
                  centered={false}
                  closeIcon
                  size="large">
        <Modal.Header>
            {currentScreen.header}
        </Modal.Header>
        <Modal.Content>
            <div style={containerStyle}>
                <Container fluid>
                    {currentScreen.view}
                </Container>
            </div>
        </Modal.Content>
        <Modal.Actions>
            {currentScreen.previous}
            {currentScreen.next}
        </Modal.Actions>
    </Modal>
}

const SelectDataset = ({selectedDataset, selectedStyle, show}) => {
    return <React.Fragment>
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
                                        onClick={show(true, sampleGraphs[key].name)}>
                                    Select
                                </Button>
                            </div>
                        </Card.Content>
                    </Card>
                );
            })}
        </CardGroup>
    </React.Fragment>
}

const ImportDataset = ({selectedDataset, completedQueryIndexes, currentQueryIndex, completed, loadDataset}) => {
    return <React.Fragment>
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
                    {completedQueryIndexes[queryIndex] ?
                        <Icon color='green' name='check'/> : null}
                    <pre style={{whiteSpace: 'pre-wrap'}}>{query};</pre>
                    <Clipboard onSuccess={(event) => {
                        sendMetrics('neuler-sample-graphs', "copied-code", {
                            type: "sample-graph-query",
                            graph: selectedDataset
                        })
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
                    fluid
                    color='green'
                    content="Yes, load it!"
                    onClick={loadDataset}
                />

            </div>
        }
    </React.Fragment>
}

const SelectAlgorithms = (props) => {
    const {selectedDataset} = props

    const history = useHistory();

    const addLimits = (params) => {
        return {
            ...params,
            limit: props.limit,
            communityNodeLimit: props.communityNodeLimit
        }
    }

    const generateAlgorithmState = (group, algorithm) => {
        const {parameters, parametersBuilder} = getAlgorithmDefinitions(group, algorithm, props.metadata.versions.gdsVersion)
        const params = parametersBuilder({
            ...parameters,
            requiredProperties: Object.keys(parameters)
        })

        const formParameters = addLimits(parameters);
        return {
            group: group,
            algorithm: algorithm,
            newParameters: params,
            formParameters: formParameters
        }
    }


    return <React.Fragment>
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
                                    sendMetrics('neuler-sample-graphs', "try-out-algorithm", {
                                        category: item.category,
                                        name: item.name
                                    });
                                    history.push({
                                        pathname: '/algorithms/new',
                                        state: generateAlgorithmState(item.category, item.name)
                                    })
                                    props.allDone()
                                }}>
                                    Try it out
                                </Button>
                            </div>
                        </Card.Content>
                    </Card>
                );
            })}
        </CardGroup>

    </React.Fragment>
}


const mapStateToProps = state => ({
    metadata: state.metadata,
    limit: state.settings.limit,
    communityNodeLimit: state.settings.communityNodeLimit,
})

export default connect(mapStateToProps)(Datasets)
