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
    super(props)
    this.visContainer = React.createRef()

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

  onConfigChange(reload) {
    const { captions, cypher } = this.state
    this.config.labels = Object.keys(captions).reduce((labelConfig, label) => {
      labelConfig[label] = {
        caption: captions[label],
        size: this.props.writeProperty
      }
      return labelConfig
    }, {})

    this.config.initial_cypher = this.state.cypher
    this.config.container_id = 'div_'+ this.state.taskId

    const {relationshipType} = this.props

    if(relationshipType) {
      this.config.relationships = {
        [relationshipType]: {
          caption: false
        }
      }
    }

   /* if (reload === true) {
      this.vis.renderWithCypher(cypher)
    } else {*/
      this.vis = new NeoVis(this.config, getDriver());
      this.vis.render();
    //}
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

  componentDidMount() {
    this.dataUpdated(this.props)
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.taskId !== this.props.taskId || nextProps.results !== this.props.results) {
      this.dataUpdated(nextProps)

      this.vis && this.vis.clearNetwork()
    } else if (nextProps.active !== this.props.active) {
      if (nextProps.active) {
        if (this.height && this.width) {
          this.vis.setSize(this.width, this.height)
        }
      } else {
        this.height = this.visContainer.current.clientHeight
        this.width = this.visContainer.current.clientWidth
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
              <Button basic icon labelPosition='right' onClick={this.onConfigChange.bind(this)}>
                Refresh
                <Icon name='refresh'/>
              </Button>
            </Form.Field>
          </Form.Group>
        </Form>
      </Grid.Row>
      <Grid.Row>
        <div style={{ width: '100%', height: '100%' }} id={'div_' + this.state.taskId} ref={this.visContainer}/>
      </Grid.Row>
    </Grid>
  }
}
