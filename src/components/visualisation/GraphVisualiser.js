import React, {Component} from 'react'
import { Grid, Form, Button, Icon, Select, Loader, Input } from "semantic-ui-react"
import NeoVis from "./neovis"
import { getDriver } from "../../services/stores/neoStore"
import VisConfigurationBar from './VisConfigurationBar'
import { layoutDr } from "./communityLayout"

const captionCandidates = ['name', 'title']

export default class extends Component {
  state = {
    taskId: null,
    labels: {},
    captions: {},
    nodeSize: null,
    nodeColour: null,
    relationshipThickness: "weight",
    cypher: null
  }

  constructor(props) {
    console.log('CONSTRUCTOR')
    super(props)
    this.visContainer = React.createRef()

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
      initial_cypher: `match (n:Person)
      where exists(n.pagerank)
      return n`
    }
  }

  getVis() {
    return this.networks[this.props.taskId]
  }

  onUpdateConfig(props) {
    const { captions, cypher, nodeSize, nodeColor } = this.state
    const { taskId, relationshipType, algorithm } = props

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

    if(relationshipType) {
      this.config.relationships = {
        [relationshipType]: {
          caption: false,
          thickness: "weight"
        }
      }
    }

    const initVis = (taskId, config, driver) => {
      this.setState({ rendering: true })
      const neovis = new NeoVis(config, driver);
      console.log('RENDERING')
      neovis.render(() => {
        console.log('RENDERING DONE')
        this.setState({ rendering: false })
      }, algorithm === 'Louvain' ? layoutDr : null);
      this.networks[taskId] = neovis
    }

    if (this.networks[taskId]) {
      // CLEAR CANVAS? REASSING IT??
      if (this.networks[taskId]._config.labels !== this.config.labels) {
        this.networks[taskId].setContainerId(this.config.container_id)
      } else {
       initVis(taskId, this.config, getDriver())
      }
    } else {
      initVis(taskId, this.config, getDriver())
    }
  }

  generateCypher(label, relationshipType, writeProperty, hideLonelyNodes = true) {
    if (hideLonelyNodes) {
      return `match path = (n${label ? ':' + label : ''})-[${relationshipType ? ':' + relationshipType : ''}]-()
return path`
    } else {
      return `match path = (n${label ? ':' + label : ''})
where not(n["${writeProperty}"] is null)
return path
union
match path = ()-[${relationshipType ? ':'+relationshipType : ''}]-()
return path`
    }
  }

  generateCypherForCommunities (label, relationshipType, writeProperty) {
    return `MATCH (node${label ? ':' + label : ''})
WHERE not(node["${writeProperty}"] is null) ${relationshipType ? `AND exists((node)-[${relationshipType ? ':' + relationshipType : ''}]-())` : ''}
WITH collect(distinct node["${writeProperty}"]) AS allCommunities
MATCH path = (node${label ? ':' + label : ''})-[rel${relationshipType ? ':' + relationshipType : ''}]-(other)
WHERE not(node["${writeProperty}"] is null) AND not(other["${writeProperty}"] is null)
WITH allCommunities, node, node["${writeProperty}"] AS community, other, other["${writeProperty}"] AS otherCommunity, rel
CALL apoc.create.vNode(labels(node), node {.*, vector: algo.ml.oneHotEncoding(allCommunities, [community])}) yield node as n
CALL apoc.create.vNode(labels(other),  other {.*, vector: algo.ml.oneHotEncoding(allCommunities, [otherCommunity])}) yield node as o
return n, o, rel`
  }

  dataUpdated(props) {
    const { results, label, relationshipType, taskId, writeProperty, algorithm } = props

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

      const generateCypher = algorithm === 'Louvain' ? this.generateCypherForCommunities : this.generateCypher

      this.setState({
        cypher: generateCypher(label, relationshipType, writeProperty),
        labels: labelProperties,
        captions,
        taskId
      })
    }
  }

  updateCaption(label, prop) {
    const captions = { ...this.state.captions }
    captions[label] = prop.value

    this.setState({ captions })
  }

  updateNodeSize(nodeSize) {
    this.setState({ nodeSize })
  }

  updateNodeColor(nodeColor) {
    this.setState({ nodeColor })
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

    if (!nextProps.active && this.getVis()) {

      const height = this.visContainer.current.clientHeight
      const width = this.visContainer.current.clientWidth

      if (height > 100 && width > 100) {
        this.width = width
        this.height = height
        console.log(`Set size to ${this.width} x ${this.height}`)
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.active && (prevProps.taskId !== this.props.taskId || prevProps.results !== this.props.results)) {
      this.onUpdateConfig(this.props)
    }

    if (this.props.active !== prevProps.active) {
      if (this.props.active) {
        const vis = this.getVis()

        if (vis) {
          if (this.height && this.width) {
            console.log(`Restoring size to ${this.width} x ${this.height}`)
            this.getVis().setSize(this.width, this.height)
          }
        } else {
          this.onUpdateConfig(this.props)
        }
      }
    }
  }

  render() {
    const { labels, rendering, nodeSize, nodeColor, captions } = this.state

    return <Grid divided='vertically' columns={1}>
      <Grid.Row style={{ marginLeft: '1em' }}>
        <VisConfigurationBar labels={labels} captions={captions} nodeSize={nodeSize} nodeColor={nodeColor}
                             updateCaption={this.updateCaption.bind(this)}
                             updateNodeSize={this.updateNodeSize.bind(this)}
                             updateNodeColor={this.updateNodeColor.bind(this)}
                             onUpdateConfig={this.onUpdateConfig.bind(this, this.props)}/>
      </Grid.Row>
      <Grid.Row>
         <LoaderExampleInlineCentered active={rendering}/>
        <div style={{ width: '100%', height: '100%' }} id={'div_' + this.props.taskId} ref={this.visContainer}/>
      </Grid.Row>
    </Grid>
  }
}

const LoaderExampleInlineCentered = ({active}) => <Loader active={active} inline='centered'>Rendering</Loader>
