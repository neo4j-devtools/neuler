import React, {Component} from 'react'
import {Button, Container, Divider, Message, Tab} from "semantic-ui-react"
import RenderParams from "./renderParams"
import {v4 as generateId} from 'uuid'
import Clipboard from 'react-clipboard.js';
import stringifyObject from "stringify-object";
import * as neo from 'neo4j-driver'
import {hasNamedDatabase} from "../services/stores/neoStore";
import {sendMetrics} from "./metrics/sendMetrics";
import {filterParameters} from "../services/queries";
import {OpenCloseSection} from "./Form/OpenCloseSection";

const generateGuidesUrl = 'https://3uvkamww2b.execute-api.us-east-1.amazonaws.com/dev/generateBrowserGuide'

const removeSpacing = (query) => query.replace(/^[^\S\r\n]+|[^\S\r\n]+$/gm, "")

export const constructQueries = (algorithmDefinition, parameters, streamQuery) => {
    const graphProperties = filterParameters(parameters.config, [])
    const algorithmProperties = filterParameters(parameters.config, [
        "writeProperty", "writeRelationshipType",
        "maxIterations", "normalization", "dampingFactor", "samplingSize",
        "similarityCutoff", "degreeCutoff", "includeIntermediateCommunities", "seedProperty",
        "latitudeProperty", "longitudeProperty", "propertyKeyLat", "propertyKeyLon",
        "relationshipWeightProperty"
    ])

    Object.keys(algorithmProperties).forEach(key => {
        if (neo.isInt(algorithmProperties[key])) {
            algorithmProperties[key] = algorithmProperties[key].toNumber()
        }
    })

    const generatedName = `in-memory-graph-${Date.now()}`
    const createGraph = `CALL gds.graph.create("${generatedName}", $config.nodeProjection, $config.relationshipProjection, ${stringfyParam(graphProperties)})`
    const dropGraph = `CALL gds.graph.drop("${generatedName}")`

    const storeAlgorithmNamedGraph = `CALL ${algorithmDefinition.algorithmName}.write("${generatedName}", ${stringfyParam(algorithmProperties)})`;
    const streamAlgorithmNamedGraph = algorithmDefinition.namedGraphStreamQuery ?
        algorithmDefinition.namedGraphStreamQuery(generatedName) :
        streamQuery.replace("$config", `"${generatedName}", ${stringfyParam(algorithmProperties)}`)

    return {
        createGraph,
        dropGraph,
        storeAlgorithmNamedGraph,
        streamAlgorithmNamedGraph
    }
}

export const stringfyParam = value => {
    if (!value) {
        return 'null'
    }

    if (typeof value === 'object') {
        return '{' + Object.keys(value).map(key => `${key}: ${JSON.stringify(value[key])}`).join(', ') + '}'
    } else {
        return JSON.stringify(value)
    }
}

export default class extends Component {
    state = {
        browserGuide: {},
        activeTab: "Anonymous Graph"
    }

    extractValue(parameters, key) {
        return parameters[key]
            ? (typeof parameters[key] === 'string'
                ? `'${parameters[key].replace(/'/g, "\\'")}'`
                : (typeof parameters[key] === "object" ? `${stringifyObject(parameters[key], {
                    indent: "  ",
                    transform: (obj, prop, originalResult) => {
                        if (neo.isInt(obj[prop])) {
                            return obj[prop].toNumber()
                        }
                        return originalResult
                    }
                })}` : ` ${parameters[key]}`))
            : 'null';
    }

    constructPayload(parameters, query, guid, supportsNamedGraph, namedGraphQueries) {
        return {
            uuid: guid,
            params: Object.keys(parameters).map(key => `:param ${key} => (${this.extractValue(parameters, key)});`).join('\n'),
            query: query,
            supportsNamedGraph,
            namedGraphQueries
        }
    }

    generateGuide(task) {
        const {parameters, query, namedGraphQueries, taskId, algorithm, group} = task
        const guid = generateId()

        const supportsNamedGraph = this.supportsNamedGraph(group, algorithm)

        const payload = this.constructPayload(parameters, query, guid, supportsNamedGraph, namedGraphQueries)

        return fetch(generateGuidesUrl, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        })
            .then(response => {
                sendMetrics('neuler-code-view', "generated-browser-guide", {guideId: guid})
                this.setState({
                    browserGuide: {
                        ...this.state.browserGuide,
                        [taskId]: `:play neuler/user-content-${guid}.html`
                    }
                })
                return guid
            })
            .catch(err => {
                console.log('GENERATE GUIDE CALL ERROR', err)
                throw (err)
            })
    }

    openBrowser(task) {
        this.generateGuide(task)
            .then(guideId => {
                window.open(`neo4j-desktop://graphapps/neo4j-browser?cmd=play&arg=neuler/user-content-${guideId}.html`, '_self')
            })
    }

    renderNamedDatabaseParam = (activeDatabase) => {
        return hasNamedDatabase() ? <Message>
                <pre>:use {activeDatabase};</pre>
                <Clipboard onSuccess={(event) => {
                    sendMetrics('neuler-code-view', "copied-code", {type: "database-name", tab: this.state.activeTab})
                    event.trigger.textContent = "Copied";
                    setTimeout(() => {
                        event.trigger.textContent = 'Copy';
                    }, 2000);
                }}
                           button-className="code"
                           data-clipboard-text={`:use ${activeDatabase};`}>
                    Copy
                </Clipboard>
            </Message> : null
    }
    renderParams = (task) => {
        return task.parameters
            ? <Message>
                <RenderParams parameters={task.parameters} activeTab={this.state.activeTab} />
            </Message>
            : null
    }

    createPanes(task) {
        const anonymous = this.renderQueries(task.query)
        const named = this.renderQueries(task.namedGraphQueries);
        const namedDatabaseParam = this.renderNamedDatabaseParam(task.database)
        const params = this.renderParams(task)

        return [
            {
                menuItem: "Anonymous Graph", render: () => <div>
                    <React.Fragment>
                        <p>
                            An anonymous graph is created for the duration of the algorithm run. It is deleted before
                            the algorithm returns its results.
                        </p>
                        {namedDatabaseParam}
                        {params}
                        {anonymous}
                    </React.Fragment>

                </div>,
            },
            {
                menuItem: "Named Graph", render: () => <div>
                    <React.Fragment>
                        <p>
                            A named graph is created in memory and remains there until it is explicitly deleted.
                            Multiple algorithms can be run against a single named graph.
                        </p>
                        {namedDatabaseParam}
                        {params}
                        {named}
                    </React.Fragment>
                </div>,
            }
        ]
    }

    renderQueries = queries => {
        return queries.map(query => {
            const cleanQuery = removeSpacing(query.replace('\n  ', '\n')) + ";";
            return <Message key={cleanQuery}>

                <pre>{query && cleanQuery}</pre>
                <Clipboard onSuccess={(event) => {
                    sendMetrics('neuler-code-view', "copied-code", {type: "query", tab: this.state.activeTab})
                    event.trigger.textContent = "Copied";
                    setTimeout(() => {
                        event.trigger.textContent = 'Copy';
                    }, 2000);
                }}
                           button-className="code"
                           data-clipboard-text={query && cleanQuery}>
                    Copy
                </Clipboard>
            </Message>
        });
    }

    onTabChange = (event, data) => {
        this.setState({
            activeTab: data.panes[data.activeIndex].menuItem
        })
    }

    supportsNamedGraph = (group, algorithm) => {
        const noNamedGraph = {
            "Similarity": ["Cosine", "Pearson", "Euclidean", "Overlap"]
        }
        return !(noNamedGraph[group] && noNamedGraph[group].includes(algorithm))
    }

    codeFragments = (task) => {
        if(!task.query) {
            return null
        }

        if (this.supportsNamedGraph(task.group, task.algorithm)) {
            return <div>
                <Tab menu={{color: "blue", secondary: true}} panes={this.createPanes(task)}
                     onTabChange={this.onTabChange.bind(this)}/>
            </div>
        } else {
            const anonymous = this.renderQueries(task.query)
            const namedDatabaseParam = this.renderNamedDatabaseParam()
            const params = this.renderParams(task)

            return <React.Fragment>
                {namedDatabaseParam}
                {params}
                {anonymous}
            </React.Fragment>
        }
    }

    render() {
        const {task} = this.props
        const {browserGuide} = this.state
        const taskGuide = browserGuide[task.taskId]

        return (
            <div style={{
                overflowY: 'auto',
                overflowX: 'hidden'
            }}>

                <OpenCloseSection title="Generate Neo4j Browser Guide">
                <p>
                    You can generate a Neo4j Browser guide that contains the code to reproduce the algorithm run:
                </p>

                {
                    task.query ?
                        <div>
                            <Button basic color='green' icon='play' content='Send to Neo4j Browser'
                                    onClick={() => this.openBrowser.bind(this)(task)} style={{marginBottom: "1rem"}}/>
                            {taskGuide && <p>
                                If the Neo4j Browser doesn't automatically open, you can copy/paste the following
                                command into the Neo4j Browser:
                            </p>}

                            {taskGuide ? <Message style={{margin: "1em 1em 0em 0em"}}>
                                <pre>{taskGuide}</pre>

                                <Clipboard onSuccess={(event) => {
                                    sendMetrics('neuler-code-view', "copied-code", {type: "browser-guide"})
                                    event.trigger.textContent = "Copied";
                                    setTimeout(() => {
                                        event.trigger.textContent = 'Copy';
                                    }, 2000);
                                }}
                                           button-className="code"
                                           data-clipboard-text={taskGuide}>
                                    Copy
                                </Clipboard>
                            </Message> : null}
                        </div>
                        : null
                }
                </OpenCloseSection>

                <OpenCloseSection title="Run code fragments">

                    <p style={{margin: "1rem 0"}}>
                        Or you can reproduce the algorithm run by running the following code fragments:
                    </p>

                    {
                        this.codeFragments(task)
                    }

                </OpenCloseSection>
            </div>
        )
    }

}
