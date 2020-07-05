import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Button, Card, Form, Icon} from 'semantic-ui-react'

import {v4 as generateTaskId} from 'uuid'
import {addTask} from "../ducks/tasks"
import {getAlgorithmDefinitions} from "./algorithmsLibrary"
import {getCurrentAlgorithm} from "../ducks/algorithms"

import * as PropTypes from "prop-types";
import {limit} from "../ducks/settings"

class Algorithms extends Component {
  constructor(props, context) {
    super(props, context);
  }

  state = {
    collapsed: false,
    parameters: {},
    labelOptions: [{ key: null, value: null, text: 'Any' }],
    relationshipTypeOptions: [{ key: "*", value: "*", text: 'Any' }],
    propertyKeyOptions: [],
    relationshipOrientationOptions: [{ key: "Natural", value: "Natural", text: 'Natural' }],
  }

  static contextTypes = {
    driver: PropTypes.object
  };

  componentDidMount() {
    const { activeGroup, activeAlgorithm, metadata } = this.props

    const { parameters } = getAlgorithmDefinitions(activeGroup, activeAlgorithm, metadata.versions.gdsVersion)
    this.setState({ parameters })
    this.loadMetadata(metadata)
  }

  componentWillReceiveProps(nextProps, nextContext) {
    console.log(nextProps.currentAlgorithm)
    if (this.props.currentAlgorithm !== nextProps.currentAlgorithm) {
      const { activeGroup, activeAlgorithm, metadata } = nextProps
      const { parameters } = getAlgorithmDefinitions(activeGroup, activeAlgorithm, metadata.versions.gdsVersion)
      this.setState({ parameters })
    }

    if (this.props.metadata !== nextProps.metadata) {
      this.loadMetadata(nextProps.metadata)
    }
  }

  loadMetadata(metadata) {
    const labels = metadata.labels.map(row => {
      return { key: row.label, value: row.label, text: row.label }
    })
    labels.unshift({ key: "*", value: "*", text: 'Any' })
    this.setState({
      labelOptions: labels,
    })

    const relationshipTypes = metadata.relationshipTypes.map(row => {
      return { key: row.label, value: row.label, text: row.label }
    })
    relationshipTypes.unshift({ key: "*", value: "*", text: 'Any' })
    this.setState({
      relationshipTypeOptions: relationshipTypes
    })

    const propertyKeys = metadata.propertyKeys.map(row => {
      return { key: row.propertyKey, value: row.propertyKey, text: row.propertyKey }
    })

    this.setState({
      propertyKeyOptions: propertyKeys
    })

    const relationshipOrientationOptions = [
      {key: "Natural", value: "Natural", text: "Natural"},
      {key: "Reverse", value: "Reverse", text: "Reverse"},
      {key: "Undirected", value: "Undirected", text: "Undirected"},
    ]
    this.setState({
      relationshipOrientationOptions: relationshipOrientationOptions
    })
  }

  onChangeParam(key, value) {
    const parameters = { ...this.state.parameters }
    parameters[key] = value
    this.setState({
      parameters
    })
  }

  onRunAlgo() {
    const taskId = generateTaskId()

    const { service, parametersBuilder } = this.props.currentAlgorithm
    const { activeGroup, activeAlgorithm } = this.props

    if (service) {
      const parameters = parametersBuilder({
        ...this.state.parameters,
        requiredProperties: Object.keys(this.state.parameters)
      })

      const persisted = this.state.parameters.persist


      this.props.addTask(taskId, activeGroup, activeAlgorithm, { ...parameters, limit: this.props.limit }, persisted)
    }
  }

  toggleCollapse() {
    this.setState(({ collapsed }) => ({ collapsed: !collapsed }))
  }

  render() {
    const { Form: AlgoForm, description } = this.props.currentAlgorithm
    const { collapsed } = this.state

    // const Feedback = <FeedbackForm page={`${this.props.activeAlgorithm}/Form`} />

    const containerStyle = {
      display: 'flex',
      width: '96%',
      overflow: 'hidden',
      height: '100%',
      alignItems: 'flex-start',
      marginRight: '0'
    }

    const contentStyle = {
      display: 'flex',
      padding: '0 0 0 1em'
    }

    let toggleIcon = 'angle double left'

    if (collapsed) {
      // containerStyle.height = '15em';
      toggleIcon = 'angle double right'
    }

    const collapseButton = <Button style={{ height: collapsed ? '-webkit-fill-available' : null, borderRadius: '0' }}
                                   icon size='mini' onClick={this.toggleCollapse.bind(this)}>
      <Icon name={toggleIcon}/>
    </Button>

    return collapsed
      ? collapseButton
      : (
        <div style={containerStyle}>
          <Card style={{ boxShadow: 'none' }}>
            <Card.Content style={contentStyle}>
              <div style={{ paddingTop: '1em', paddingBottom: '1em' }}>
                <Icon name='sitemap'/>
                <Card.Header>
                  {this.props.activeAlgorithm}
                </Card.Header>
                <Card.Meta>{description}
                </Card.Meta>
              </div>
              {collapseButton}
            </Card.Content>
            <Card.Content extra>
              <div style={{marginBottom: '1em'}}>
                <AlgoForm {...this.state.parameters} labelOptions={this.state.labelOptions}
                          relationshipTypeOptions={this.state.relationshipTypeOptions}
                          relationshipOrientationOptions={this.state.relationshipOrientationOptions}
                          propertyKeyOptions={this.state.propertyKeyOptions}
                          onChange={this.onChangeParam.bind(this)}/>
                <Form size='mini'>
                  <Form.Field inline>
                    <label style={{ 'width': '8em' }}>Rows to show</label>
                    <input
                      type='number'
                      placeholder="Rows"
                      min={1}
                      max={1000}
                      step={1}
                      value={this.props.limit}
                      onChange={evt => this.props.updateLimit(parseInt(evt.target.value))}
                    />
                  </Form.Field>
                </Form>
              </div>
              <div className='ui two buttons'>
                <Button basic color='green' onClick={this.onRunAlgo.bind(this)}>
                  Run
                </Button>
                <Button basic color='red'>
                  Cancel
                </Button>
              </div>
            </Card.Content>
          </Card>
          {/*{<div style={{ height: '100%', width: '1em', textAlign: 'center', paddingTop: '1em' }}>
          <Button icon size='mini' onClick={this.toggleCollapse.bind(this)}>
            <Icon name={toggleIcon}/>
          </Button>
        </div>}*/}

          {/*{Feedback}*/}

        </div>
      )
  }
}

const mapStateToProps = state => ({
  activeGroup: state.algorithms.group,
  activeAlgorithm: state.algorithms.algorithm,
  currentAlgorithm: getCurrentAlgorithm(state),
  metadata: state.metadata,
  limit: state.settings.limit
})

const mapDispatchToProps = dispatch => ({
  updateLimit: value => dispatch(limit(value)),
  addTask: (taskId, group, algorithm, parameters, persisted) => {
    const task = {
      group,
      algorithm,
      taskId,
      parameters,
      persisted,
      startTime: new Date()
    }
    dispatch(addTask({ ...task }))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Algorithms)
