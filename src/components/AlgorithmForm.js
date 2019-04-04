import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Button, Card, Icon} from 'semantic-ui-react'

import {v4 as generateTaskId} from 'uuid'
import {addTask, completeTask} from "../ducks/tasks"
import {getAlgorithmDefinitions} from "./algorithmsLibrary"
import {getCurrentAlgorithm} from "../ducks/algorithms"

import * as PropTypes from "prop-types";

class Algorithms extends Component {
  constructor(props, context) {
    super(props, context);
  }

  state = {
    collapsed: false,
    parameters: {},
    labelOptions: [{ key: null, value: null, text: 'Any' }],
    relationshipTypeOptions: [{ key: null, value: null, text: 'Any' }]
  }

  static contextTypes = {
        driver: PropTypes.object
  };

  componentDidMount() {
    const { activeGroup, activeAlgorithm, metadata } = this.props
    const { parameters } = getAlgorithmDefinitions(activeGroup, activeAlgorithm)
    this.setState({ parameters })
    this.loadMetadata(metadata)
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(this.props.currentAlgorithm !== nextProps.currentAlgorithm) {
      const { activeGroup, activeAlgorithm } = nextProps
      const { parameters } = getAlgorithmDefinitions(activeGroup, activeAlgorithm)
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
    labels.unshift({ key: null, value: null, text: 'Any' })
    this.setState({
      labelOptions: labels,
    })

    const relationshipTypes = metadata.relationshipTypes.map(row => {
      return { key: row.label, value: row.label, text: row.label }
    })
    relationshipTypes.unshift({ key: null, value: null, text: 'Any' })
    this.setState({
      relationshipTypeOptions: relationshipTypes
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

    const { service, parametersBuilder, storeQuery, streamQuery, getFetchQuery } = this.props.currentAlgorithm
    const { activeGroup, activeAlgorithm } = this.props

    if (service) {
      const parameters = parametersBuilder({
        ...this.state.parameters,
        requiredProperties: Object.keys(this.state.parameters)
      })
      const fetchCypher = getFetchQuery(parameters.label)
      const persisted = this.state.parameters.persist


      this.props.addTask(taskId, activeGroup, activeAlgorithm, { ...parameters }, persisted)
    }
  }

  toggleCollapse() {
    this.setState(({ collapsed }) => ({ collapsed: !collapsed }))
  }

  render() {
    const { Form, description } = this.props.currentAlgorithm

    const containerStyle = {
      display: 'flex',
      width: '96%',
      overflow: 'hidden',
      height: '100%',
      alignItems: 'flex-start'
    }

    let toggleIcon = 'angle double up'

    if (this.state.collapsed) {
      // containerStyle.height = '15em';
      toggleIcon = 'angle double down'
    }

    return (
      <div style={containerStyle}>
        <Card>
          <Card.Content>
            <Icon name='sitemap'/>
            <Card.Header>
              {this.props.activeAlgorithm}
            </Card.Header>
            <Card.Meta>{description}
            </Card.Meta>
          </Card.Content>
          <Card.Content extra>
            <div>
              <Form {...this.state.parameters} labelOptions={this.state.labelOptions}
                    relationshipTypeOptions={this.state.relationshipTypeOptions}
                    onChange={this.onChangeParam.bind(this)}/>
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
       {/* <div style={{ height: '100%', width: '1em', textAlign: 'center', paddingTop: '1em' }}>
          <Button icon size='mini' onClick={this.toggleCollapse.bind(this)}>
            <Icon name={toggleIcon}/>
          </Button>
        </div>*/}

      </div>
    )
  }
}

const mapStateToProps = state => ({
  activeGroup: state.algorithms.group,
  activeAlgorithm: state.algorithms.algorithm,
  currentAlgorithm: getCurrentAlgorithm(state),
  metadata: state.metadata
})

const mapDispatchToProps = dispatch => ({
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
