import React, {Component} from 'react'
import { Grid, Form, Button, Icon, Select } from "semantic-ui-react"
import NeoVis from "./visualisation/neovis"
import { getDriver } from "../services/stores/neoStore"

export default class extends Component {
  state = {
    taskId: null,
    labels: {},
    captions: {},
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
          size: "pagerank"
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
    const { captions, cypher } = this.state
    const { taskId, writeProperty, relationshipType } = props
    this.config.labels = Object.keys(captions).reduce((labelConfig, label) => {
      labelConfig[label] = {
        caption: captions[label],
        size: writeProperty
      }
      return labelConfig
    }, {})

    this.config.initial_cypher = cypher
    this.config.container_id = 'div_' + taskId

    if(relationshipType) {
      this.config.relationships = {
        [relationshipType]: {
          caption: false
        }
      }
    }

    const initVis = (taskId, config, driver) => {
      const neovis = new NeoVis(config, driver);
      neovis.render();
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

  generateCypher(label, relationshipType, writeProperty) {
    return `match path = (n${label ? ':'+label : ''})
where not(n["${writeProperty}"] is null)
return path
union
match path = ()-[${relationshipType ? ':'+relationshipType : ''}]-()
return path`
  }

  dataUpdated(props) {
    const {results, label, relationshipType, writeProperty, taskId} = props

    let captions = {}
    if (results && results.length > 0) {

      const labelProperties = results.reduce((labelsMap, result) => {
        if (result.labels) {
          result.labels.forEach(label => {
            if (!labelsMap[label]) {
              labelsMap[label] = new Set()
            }
            Object.keys(result.properties).forEach((prop, idx) => {
              if (idx === 0) {
                captions[label] = prop
              }
              labelsMap[label].add(prop)
            })
          })
        }

        return labelsMap
      }, {})

      this.setState({
        cypher: this.generateCypher(label, relationshipType, writeProperty),
        labels: labelProperties, captions,
        taskId
      })
    }
  }

  updateCaption(label, prop) {
    console.log(label, prop.value)

    const captions = { ...this.state.captions }
    captions[label] = prop.value

    this.setState({ captions })
  }

  componentWillReceiveProps(nextProps) {
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
    const { labels } = this.state

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
        <div style={{ width: '100%', height: '100%' }} id={'div_' + this.props.taskId} ref={this.visContainer}/>
      </Grid.Row>
    </Grid>
  }
}
