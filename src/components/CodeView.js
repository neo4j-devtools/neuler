import React, {Component} from 'react'
import {Tab, Button, Message, Popup, Segment} from "semantic-ui-react"
import RenderParams from "./renderParams"
import {v4 as generateId} from 'uuid'
import Clipboard from 'react-clipboard.js';
import stringifyObject from "stringify-object";
import * as neo from 'neo4j-driver'
import {getActiveDatabase, hasNamedDatabase} from "../services/stores/neoStore";
import {sendMetrics} from "./metrics/sendMetrics";

const generateGuidesUrl = 'https://3uvkamww2b.execute-api.us-east-1.amazonaws.com/dev/generateBrowserGuide'


const removeSpacing = (query) => query.replace(/^[^\S\r\n]+|[^\S\r\n]+$/gm, "")

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
        browserGuide: {}
    }

    extractValue(parameters, key) {
        return parameters[key]
            ? (typeof parameters[key] === 'string'
                ? `'${parameters[key]}'`
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

    constructPayload(parameters, query, guid) {
        return {
            uuid: guid,
            params: Object.keys(parameters).map(key => `:param ${key} => (${this.extractValue(parameters, key)});`).join('\n'),
            query: query
        }
    }


    generateGuide(parameters, query, taskId) {
        const guid = generateId()

        const payload = this.constructPayload(parameters, query, guid)

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
        const {parameters, query, taskId} = task
        this.generateGuide(parameters, query, taskId)
            .then(guideId => {
                window.open(`neo4j-desktop://graphapps/neo4j-browser?cmd=play&arg=neuler/user-content-${guideId}.html`, '_self')
            })
    }

    createPanes(task) {
        const anonymous = task.query.map(query => {
            return <Segment>
                <pre>{query && removeSpacing(query.replace('\n  ', '\n'))}</pre>
                <Clipboard onSuccess={(event) => {
                    sendMetrics('neuler-code-view', "copied-code", {type: "query"})
                    event.trigger.textContent = "Copied";
                    setTimeout(() => {
                        event.trigger.textContent = 'Copy';
                    }, 2000);
                }}
                           button-className="code"
                           data-clipboard-text={query && removeSpacing(query.replace('\n  ', '\n'))}>
                    Copy
                </Clipboard>
            </Segment>
        })

        const named =
            task.namedGraphQueries.map(query => {
                const cleanQuery = removeSpacing(query.replace('\n  ', '\n'));
                return <Segment>

                    <pre>{query && cleanQuery}</pre>
                    <Clipboard onSuccess={(event) => {
                        sendMetrics('neuler-code-view', "copied-code", {type: "query"})
                        event.trigger.textContent = "Copied";
                        setTimeout(() => {
                            event.trigger.textContent = 'Copy';
                        }, 2000);
                    }}
                               button-className="code"
                               data-clipboard-text={query && cleanQuery}>
                        Copy
                    </Clipboard>
                </Segment>
            })

        const activeDatabase = `\`${getActiveDatabase()}\``;
        const namedDatabaseParam =
            hasNamedDatabase() ? <Segment>
            <pre>:use {activeDatabase}</pre>
            <Clipboard onSuccess={(event) => {
                sendMetrics('neuler-code-view', "copied-code", {type: "database-name"})
                event.trigger.textContent = "Copied";
                setTimeout(() => {
                    event.trigger.textContent = 'Copy';
                }, 2000);
            }}
                       button-className="code"
                       data-clipboard-text={`:use ${activeDatabase}`}>
                Copy
            </Clipboard>

        </Segment> : null

        const params =
            task.parameters
                ? <Segment>
                    <RenderParams parameters={task.parameters}/>
                </Segment>
                : null


        return [
            {
                menuItem: "Anonymous Graph", render: () => <Tab.Pane attached={false}>
                    <React.Fragment>
                        <p>
                            An anonymous graph is created for the duration of the algorithm run. It is deleted before
                            the algorithm returns its results.
                        </p>
                        {namedDatabaseParam}
                        {params}
                        {anonymous}
                    </React.Fragment>

                </Tab.Pane>,
            },
            {
                menuItem: "Named Graph", render: () => <Tab.Pane attached={false}>
                    <React.Fragment>
                        <p>
                            A named graph is created in memory and remains there until it is explicitly deleted.
                            Multiple algorithms can be run against a single named graph.
                        </p>
                        {namedDatabaseParam}
                        {params}
                        {named}
                    </React.Fragment>
                </Tab.Pane>,
            }
        ]
    }

    render() {
        const {task} = this.props
        const {browserGuide} = this.state

        const taskGuide = browserGuide[task.taskId]

        return (
            <div style={{
                height: '85vh',
                overflowY: 'auto',
                overflowX: 'hidden'
            }}>
                <h3>Generate Neo4j Browser Guide</h3>
                <p>
                    We can generate a Neo4j Browser guide that contains the code to reproduce the algorithm run:
                </p>

                {task.query ?
                    <div>
                        <Segment>
                            <Button basic color='green' icon='play' content='Send to Neo4j Browser'
                                    onClick={() => this.openBrowser.bind(this)(task)}/>
                            {taskGuide ? <Message>
                                <p>
                                    If the Neo4j Browser doesn't automatically open, you can copy/paste the following command into the Neo4j Browser:
                                </p>
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
                        </Segment>
                    </div>
                    : null
                }

                <h3>Run code fragments</h3>
                <p style={{margin: "1rem 0"}}>
                    Alternatively, the algorithm run can be reproduced in the Neo4j Browser by running the following code fragments:
                </p>


                {task.query ? <div>
                        <Tab menu={{color: "blue", secondary: true}} panes={this.createPanes(task)}/>

                    </div>
                    : null}




            </div>
        )
    }

}
