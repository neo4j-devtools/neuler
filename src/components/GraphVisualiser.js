import React, {Component} from 'react'
import { Grid, Form, Button, Icon, Select, Loader, Input } from "semantic-ui-react"
import NeoVis from "./visualisation/neovis"
import { getDriver } from "../services/stores/neoStore"

const captionCandidates = ['name', 'title']

export default class extends Component {
  state = {
    taskId: null,
    labels: {},
    captions: {},
    nodeSize: null,
    nodeColour: null,
    relationshipThickness: null,
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

  onConfigChange(props) {
    const { captions, cypher, nodeSize } = this.state
    const { taskId, writeProperty, relationshipType } = props

    // this.setState({nodeSize: writeProperty})

    this.config.labels = Object.keys(captions).reduce((labelConfig, label) => {
      labelConfig[label] = {
        caption: captions[label],
        size: nodeSize,
        community: "louvain"
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

  dataUpdated(props) {
    const { results, label, relationshipType, taskId, writeProperty } = props

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

      this.setState({
        cypher: this.generateCypher(label, relationshipType, writeProperty), //, props.algorithm === 'Louvain'),
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

  componentWillReceiveProps(nextProps) {
    if (this.props.writeProperty !== nextProps.writeProperty && nextProps.writeProperty) {
      this.updateNodeSize(nextProps.writeProperty)
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
      this.onConfigChange(this.props)
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
          this.onConfigChange(this.props)
        }
      }
    }
  }

  render() {
    const { labels,rendering, nodeSize } = this.state

    return <Grid divided='vertically' columns={1}>
      <Grid.Row style={{ marginLeft: '1em' }}>
        <Form>
          <Form.Group inline>
            {Object.keys(labels).map(label =>
              <Form.Field inline key={label}>
                <label>Caption for {label}</label>
                <Select placeholder='Select caption'
                        value={this.state.captions[label]}
                        options={Array.from(labels[label]).map(prop => ({ key: prop, value: prop, text: prop }))}
                        onChange={(evt, data) => this.updateCaption(label, data)}
                />
              </Form.Field>
            )}

            <Form.Field inline key='nodeSize'>
              <label>Node Size</label>
              <Input placeholder='Node Size'
                      value={nodeSize}
                      onChange={(evt) => this.updateNodeSize(evt.target.value)}
              />
            </Form.Field>


            <Form.Field inline>
              <Button basic icon labelPosition='right' onClick={this.onConfigChange.bind(this, this.props)}>
                Refresh
                <Icon name='refresh'/>
              </Button>
            </Form.Field>
          </Form.Group>
        </Form>
      </Grid.Row>
      <Grid.Row>
         <LoaderExampleInlineCentered active={rendering}/>
        <div style={{ width: '100%', height: '100%' }} id={'div_' + this.props.taskId} ref={this.visContainer}/>
      </Grid.Row>
    </Grid>
  }
}

const LoaderExampleInlineCentered = ({active}) => <Loader active={active} inline='centered'>Rendering</Loader>
