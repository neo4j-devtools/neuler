import React, {Component} from 'react'
import { Grid, Form, Button, Icon, Select } from "semantic-ui-react"

export default class extends Component {
  state = {
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
      server_password: "a",
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

  onConfigChange(a, b) {
    const { captions } = this.state
    this.config.labels = Object.keys(captions).reduce((labelConfig, label) => {
      labelConfig[label] = {
        caption: captions[label],
        size: this.props.writeProperty
      }
      return labelConfig
    }, {})

    this.config.initial_cypher = this.state.cypher

    this.vis = new window.NeoVis.default(this.config);
    this.vis.render();
  }

  componentDidMount() {
    const {results, label, relationshipType, writeProperty} = this.props
    this.setState({
      cypher: `match path = (n${label ? ':'+label : ''})
where not(n["${writeProperty}"] is null)
return path
union
match path = ()-[${relationshipType ? ':'+relationshipType : ''}]-()
return path`
    })
    this.dataUpdated(results)
  }

  dataUpdated(results) {
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

      this.setState({ labels: labelProperties, captions })
    }
  }

  updateCaption(label, prop) {
    console.log(label, prop.value)

    const captions = { ...this.state.captions }
    captions[label] = prop.value

    this.setState({ captions })
  }

  render() {
    const { labels } = this.state

    return <Grid divided='vertically' columns={1}>
      <Grid.Row>
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
      <Grid.Row style={{ padding: '2em 10em 0em 2em' }}>
        <div style={{ width: '100%', height: '100%' }} id='viz' ref={this.visContainer}/>
      </Grid.Row>
    </Grid>
  }
}