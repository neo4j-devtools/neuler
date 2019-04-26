import React, {Component} from 'react'
import {Grid, Form, Button, Icon, Select, Loader, Input} from "semantic-ui-react"
import VisConfigurationBar from './VisConfigurationBar'
import {getDriver, runCypher} from "../../services/stores/neoStore"
import {parseProperties} from "../../services/resultMapper"

import ForceGraph2D from 'react-force-graph-2d';

const captionCandidates = ['name', 'title']

const scale = (min, max, value, scale = 5) => {
  const diff = max / Math.max(min, 1)
  console.log('DIFF', diff)
  const newVal= Math.max(value / (diff / scale), 1)
  console.log('VALUE', value, newVal)
  return newVal
}

export default class extends Component {
  state = {
    taskId: null,
    labels: {},
    captions: {},
    nodeSize: null,
    nodeColour: null,
    relationshipThickness: "weight",
    cypher: null,
    data: null,
  }

  constructor(props) {
    console.log('CONSTRUCTOR')
    super(props)
    this.networks = {}

    this.config = {
      container_id: "viz",
      server_url: "bolt://localhost:7687",
      server_user: "neo4j",
      server_password: "neo",
      labels: {
        "Person": {
          caption: "name",
          size: "pagerank",
          community: "louvain"
        }
      },
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
    this.config.container_id = 'div_' + taskId

    if (relationshipType) {
      this.config.relationships = {
        [relationshipType]: {
          caption: false,
          thickness: "weight"
        }
      }
    }

    // const initVis = (taskId, config, driver) => {
    //   this.setState({rendering: true})
    //   const neovis = new NeoVis(config, driver);
    //   console.log('RENDERING')
    //   neovis.render(() => {
    //     console.log('RENDERING DONE')
    //     this.setState({rendering: false})
    //   });
    //   this.networks[taskId] = neovis
    // }
    //
    // if (this.networks[taskId]) {
    //   // CLEAR CANVAS? REASSING IT??
    //   if (this.networks[taskId]._config.labels !== this.config.labels) {
    //     this.networks[taskId].setContainerId(this.config.container_id)
    //   } else {
    //     initVis(taskId, this.config, getDriver())
    //   }
    // } else {
    //   initVis(taskId, this.config, getDriver())
    // }
  }

  generateCypher(label, relationshipType, writeProperty, hideLonelyNodes = true) {
    if (hideLonelyNodes) {
      return `match path = (node1${label ? ':' + label : ''})-[${relationshipType ? ':' + relationshipType : ''}]->(node2)
              return node1, node2`
    } else {
      return `match path = (n${label ? ':' + label : ''})
              where not(n["${writeProperty}"] is null)
              return path
              union
              match path = ()-[${relationshipType ? ':' + relationshipType : ''}]-()
              return path`
    }
  }

  dataUpdated(props) {
    const {results, label, relationshipType, taskId, writeProperty} = props

    let captions = {}
    if (results && results.length > 0) {

      const labelProperties = results.reduce((labelsMap, result) => {
        if (result.labels) {
          result.labels.forEach(label => {
            if (!labelsMap[label]) {
              labelsMap[label] = new Set()
            }
            Object.keys(result.properties).forEach((prop, idx) => {
              if (captionCandidates.includes(prop)) {
                captions[label] = prop
              }

              labelsMap[label].add(prop)
            })

            if (!captions[label]) {
              captions[label] = labelsMap[label][0]
            }
          })
        }

        return labelsMap
      }, {})

      const cypher = this.generateCypher(label, relationshipType, writeProperty);

      const handleException = error => {
        console.error(error)
        throw new Error(error)
      }

      const nodesSet = new Set()
      const relationships = []

      runCypher(cypher)
        .then(result => {
          result.records.map(record => {
            const node1 = record.get("node1")
            const node1Properties = parseProperties(node1.properties)

            const node2 = record.get("node2")
            const node2Properties = parseProperties(node2.properties)

            // nodesSet.add(JSON.stringify({id: node1.identity.toNumber().toString(), name:node1Properties.name, val: node1Properties[this.state.nodeSize]}))
            // nodesSet.add(JSON.stringify({id: node2.identity.toNumber().toString(), name:node2Properties.name, val: node2Properties[this.state.nodeSize]}))

            nodesSet.add(JSON.stringify({id: node1.identity.toNumber().toString(), properties: node1Properties}))
            nodesSet.add(JSON.stringify({id: node2.identity.toNumber().toString(), properties: node2Properties}))

            relationships.push({
              source: node1.identity.toNumber().toString(),
              target: node2.identity.toNumber().toString()
            })
          })

          const nodes = Array.from(nodesSet).map(_ => JSON.parse(_))

          const rawData = {
            nodes: nodes,
            links: relationships
          }

          this.refreshData(rawData, this.state.nodeSize, this.state.nodeColor)

          this.setState({
            cypher: cypher,
            rawData: rawData,
            labels: labelProperties,
            captions,
            taskId
          })

        })
        .catch(handleException)
    }
  }

  refreshData(rawData, nodeSize, nodeColour) {
    const data = {}
    data.links = rawData.links.map(value => ({source: value.source, target: value.target}))

    let min = Number.MAX_SAFE_INTEGER
    let max = 0
    rawData.nodes.forEach(node => {
      const size = node.properties[nodeSize]
      min = Math.min(min, size)
      max= Math.max(max, size)
    })

    data.nodes = rawData.nodes.map(value => ({
      id: value.id,
      name: value.properties.name,
      val: scale(min, max, value.properties[nodeSize]),
      group: value.properties[nodeColour]
    }))

    console.log("refreshData:")
    console.log(data)

    this.setState({
      data: data
    })
  }

  updateCaption(label, prop) {
    const captions = {...this.state.captions}
    captions[label] = prop.value

    this.setState({captions})
  }

  updateNodeSize(nodeSize) {
    this.setState({nodeSize})
    if(this.state.rawData) {
      this.refreshData(this.state.rawData, nodeSize, this.state.nodeColor)
    }
  }

  updateNodeColor(nodeColor) {
    this.setState({nodeColor})
    if(this.state.rawData) {
      this.refreshData(this.state.rawData, this.state.nodeSize, nodeColor)
    }
  }

  componentDidMount() {
    if (this.props.writeProperty) {
      this.updateNodeSize(this.props.writeProperty)
      this.updateNodeColor(this.props.writeProperty)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.writeProperty !== nextProps.writeProperty && nextProps.writeProperty) {
      this.updateNodeSize(nextProps.writeProperty)
      this.updateNodeColor(nextProps.writeProperty)
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

  }

  render() {
    // const {data, labels, rendering, nodeSize, nodeColor, captions} = this.state
    const {data, labels, rendering, nodeSize, nodeColor, captions} = this.state

    return <Grid divided='vertically' columns={1}>
      <Grid.Row style={{marginLeft: '1em'}}>
        <VisConfigurationBar labels={labels} captions={captions} nodeSize={nodeSize} nodeColor={nodeColor}
                             updateCaption={this.updateCaption.bind(this)}
                             updateNodeSize={this.updateNodeSize.bind(this)}
                             updateNodeColor={this.updateNodeColor.bind(this)}
                             onUpdateConfig={this.onUpdateConfig.bind(this, this.props)}/>
      </Grid.Row>
      <Grid.Row>
        <LoaderExampleInlineCentered active={rendering}/>
          {data ?
            <ForceGraph2D
              graphData={data}
              nodeId="id"
              nodeAutoColorBy='group'
              nodeRelSize={3}
            /> : null}
      </Grid.Row>
    </Grid>
  }
}

const LoaderExampleInlineCentered = ({active}) => <Loader active={active} inline='centered'>Rendering</Loader>
