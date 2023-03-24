import React, {Component} from 'react'
import {Grid, Loader} from "semantic-ui-react"
import NeoVis from "./neovis"
import {getDriver} from "../../services/stores/neoStore"
import VisConfigurationBar from './VisConfigurationBar'
import {connect} from "react-redux";

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
    limit: 50
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
      WHERE n.pagerank IS NOT NULL
      return n
      LIMIT 50`
    }
  }

  getVis() {
    return this.networks[this.props.taskId]
  }

  onUpdateConfig(props) {
    const { captions, cypher, nodeSize, nodeColor } = this.state
    const { taskId, relationshipType } = props

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

      neovis.render(() => {
        this.setState({ rendering: false })
      });
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

  generateCypher(label, relationshipType, writeProperty, limit, hideLonelyNodes = true) {
    if (hideLonelyNodes) {
      return `match path = (n${label !== '*' ? ':' + label : ''})-[${relationshipType !== '*' ? ':' + relationshipType : ''}]-()
return path
limit toInteger(${limit})`
    } else {
      return `match path = (n${label !== '*' ? ':' + label : ''})
where not(n["${writeProperty}"] is null)
return path
union
match path = ()-[${relationshipType !== '*' ? ':' + relationshipType : ''}]-()
return path
limit toInteger(${limit})`
    }
  }

  dataUpdated(props) {
    const { results, label, relationshipType, taskId, limit, writeProperty } = props

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
      if (this.props.group === 'Centralities' || centralityLikeAlgos.includes(this.props.algorithm)){
        this.updateNodeSize(this.props.writeProperty)
      } 
      if (this.props.group === 'Community Detection' && !centralityLikeAlgos.includes(this.props.algorithm)){
        this.updateNodeColor(this.props.writeProperty)
      } 
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.writeProperty !== nextProps.writeProperty && nextProps.writeProperty) {
      if (nextProps.group === 'Centralities' || centralityLikeAlgos.includes(nextProps.algorithm)){
        this.updateNodeColor(null)
        this.updateNodeSize(nextProps.writeProperty)
      } 
      if (nextProps.group === 'Community Detection' && !centralityLikeAlgos.includes(nextProps.algorithm)){
        this.updateNodeColor(nextProps.writeProperty)
        this.updateNodeSize(null)
      } 
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
        <div style={{ width: '100%', minHeight: "500px" }} id={'div_' + this.props.taskId} ref={this.visContainer}/>
      </Grid.Row>
    </Grid>
  }
}

const mapStateToProps = state => ({
  metadata: state.metadata
})

export default connect(mapStateToProps)(GraphVisualiser)

const LoaderExampleInlineCentered = ({active}) => <Loader active={active} inline='centered'>Rendering</Loader>
