import React, {Component} from 'react'
import {Grid, Loader} from "semantic-ui-react"
import {runCypher} from "../../services/stores/neoStore"
import VisConfigurationBar from './VisConfigurationBar'
import {connect} from "react-redux";
import {ForceGraph2D} from "react-force-graph";
import * as neo from "neo4j-driver";

const captionCandidates = ['name', 'title']
const centralityLikeAlgos = ['Triangle Count', 'Local Clustering Coefficient']

class GraphVisualiser extends Component {
    state = {
        taskId: null,
        labels: {},
        captions: {},
        nodeSize: null,
        nodeColor: null,
        relationshipThickness: "weight",
        cypher: null,
        limit: 50,
        data: null
    }

    constructor(props) {
        super(props)

        this.networks = {}

        this.config = {
            labels: {
                "Person": {
                    caption: "name",
                    size: "pagerank",
                    community: "louvain"
                }
            },
            initial_cypher: `match (n:Person)
      where exists(n.pagerank)
      return n
      LIMIT 50`
        }
    }

    getVis() {
        return this.networks[this.props.taskId]
    }

    onUpdateConfig(props) {
        const {captions, cypher, nodeSize, nodeColor} = this.state
        const {taskId, relationshipType} = props

        this.config.labels = Object.keys(captions).reduce((labelConfig, label) => {
            labelConfig[label] = {
                caption: captions[label],
                size: nodeSize,
                community: nodeColor
            }
            return labelConfig
        }, {})

        this.config.initial_cypher = cypher

        if (relationshipType) {
            this.config.relationships = {
                [relationshipType]: {
                    caption: false,
                    thickness: "weight"
                }
            }
        }

        const initVis = (taskId) => {
            this.setState({rendering: true})
            this.networks[taskId] = "foo"
        }

        if (this.networks[taskId]) {
            initVis(taskId)
        }
    }

    generateCypher(label, relationshipType, writeProperty, limit) {
        return `match path = (n${label !== '*' ? ':' + label : ''})-[${relationshipType !== '*' ? ':' + relationshipType : ''}]-(m)
        WHERE id(n) in $ids AND id(m) in $ids
return m, n`

    }

    dataUpdated(props) {
        const {results, label, relationshipType, taskId, limit, writeProperty} = props

        if (results && results.rows.length > 0) {
            const selectCaption = (choices) => {
                const captionCandidate = choices.find(choice => captionCandidates.includes(choice))
                return captionCandidate ? captionCandidate : choices[0]
            }

            const allowed = results.labels
            const nodePropertyKeys = this.props.metadata.nodePropertyKeys
            const labelProperties = Object.keys(nodePropertyKeys)
                .filter(key => allowed.includes(key))
                .reduce((obj, key) => {
                    return {
                        ...obj,
                        [key]: nodePropertyKeys[key]
                    };
                }, {});

            const captions = Object.keys(labelProperties).reduce((obj, key) => {
                return {
                    ...obj,
                    [key]: selectCaption(labelProperties[key])
                };
            }, {})

            this.setState({
                cypher: this.generateCypher(label, relationshipType, writeProperty, limit), //, props.algorithm === 'Louvain'),
                labels: labelProperties,
                captions,
                taskId
            })

            if (this.state.cypher !== null) {
                console.log("this.state.cypher", this.state.cypher, "task.result", props)
                const ids = props.results.ids;
                runCypher(this.state.cypher, {ids: ids}).then(result => {
                    if (result.records) {
                        const nodes = []
                        const links = result.records.map(r => {
                            const m = r.get('m')

                            const mProperties = m.properties
                            Object.keys(mProperties).forEach(key  => {
                                if (neo.isInt(mProperties[key])) {
                                    mProperties[key] = mProperties[key].toNumber()
                                }
                            })

                            const mLabels = m.labels

                            const n = r.get('n')

                            const nProperties = n.properties
                            Object.keys(nProperties).forEach(key  => {
                                if (neo.isInt(nProperties[key])) {
                                    nProperties[key] = nProperties[key].toNumber()
                                }
                            })

                            const nLabels = n.labels

                            const source = {id: m.identity.toNumber(), label: mLabels[0], ...mProperties};
                            nodes.push(source)

                            const target = {id: n.identity.toNumber(), label: nLabels[0], ...nProperties};
                            nodes.push(target)
                            return {source: source.id, target: target.id}
                        });

                        this.setState({
                            data: {
                                links: links,
                                nodes: [...new Set(nodes.map((o) => JSON.stringify(o)))].map((string) => JSON.parse(string))
                            }
                        })
                    } else {
                        console.error(result.error)
                        throw new Error(result.error)
                    }
                })
            }
        }
    }

    updateCaption(label, prop) {
        const captions = {...this.state.captions}
        captions[label] = prop.value

        this.setState({captions})
    }

    updateNodeSize(nodeSize) {
        this.setState({nodeSize})
    }

    updateNodeColor(nodeColor) {
        this.setState({nodeColor})
    }

    componentDidMount() {
        if (this.props.writeProperty) {
            if (this.props.group === 'Centralities' || centralityLikeAlgos.includes(this.props.algorithm)) {
                this.updateNodeSize(this.props.writeProperty)
            }
            if (this.props.group === 'Community Detection' && !centralityLikeAlgos.includes(this.props.algorithm)) {
                this.updateNodeColor(this.props.writeProperty)
            }
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.writeProperty !== nextProps.writeProperty && nextProps.writeProperty) {
            if (nextProps.group === 'Centralities' || centralityLikeAlgos.includes(nextProps.algorithm)) {
                this.updateNodeColor(null)
                this.updateNodeSize(nextProps.writeProperty)
            }
            if (nextProps.group === 'Community Detection' && !centralityLikeAlgos.includes(nextProps.algorithm)) {
                this.updateNodeColor(nextProps.writeProperty)
                this.updateNodeSize(null)
            }
        }

        if (nextProps.taskId !== this.props.taskId
            || nextProps.results !== this.props.results
            || nextProps.active !== this.props.active) {
            this.dataUpdated(nextProps)
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.active && (prevProps.taskId !== this.props.taskId || prevProps.results !== this.props.results)) {
            this.onUpdateConfig(this.props)
        }

        if (this.props.active !== prevProps.active) {
            if (this.props.active) {
                const vis = this.getVis()
                if (!vis)  {
                    this.onUpdateConfig(this.props)
                }
            }
        }
    }

    render() {
        const {labels, nodeSize, nodeColor, captions, data} = this.state

        console.log("data", data, "nodeSize", nodeSize, "nodeColor", nodeColor)
        return <div>
            <div style={{marginLeft: '1em'}}>
                <VisConfigurationBar labels={labels} captions={captions} nodeSize={nodeSize} nodeColor={nodeColor}
                                     updateCaption={this.updateCaption.bind(this)}
                                     updateNodeSize={this.updateNodeSize.bind(this)}
                                     updateNodeColor={this.updateNodeColor.bind(this)}
                                     onUpdateConfig={this.onUpdateConfig.bind(this, this.props)}/>
            </div>
            <div>
                {!data && <LoaderExampleInlineCentered active={true}/>}
                {data && <ForceGraph2D graphData={data}
                                       nodeVal={node => {
                                           const score = node[nodeSize]
                                           const maxValue = Math.max(...data.nodes.map(node => node[nodeSize]))
                                           return 10.0 * (score / maxValue)
                                       }}
                                       nodeAutoColorBy={nodeColor}
                                       nodeLabel={node => `${node.label}: ${node[captions[node.label]]}`}
                                       height={window.innerHeight-270}
                                       width={window.innerWidth-166}
                />}
            </div>
        </div>
    }
}

const mapStateToProps = state => ({
    metadata: state.metadata
})

export default connect(mapStateToProps)(GraphVisualiser)

const LoaderExampleInlineCentered = ({active}) => <Loader active={active} inline='centered'>Rendering</Loader>
