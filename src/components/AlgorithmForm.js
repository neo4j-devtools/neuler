import React from 'react'
import {connect} from 'react-redux'
import {Button, Card, Form, Icon} from 'semantic-ui-react'
import {addTask} from "../ducks/tasks"
import {getAlgorithmDefinitions} from "./algorithmsLibrary"
import {getCurrentAlgorithm} from "../ducks/algorithms"
import {communityNodeLimit, limit} from "../ducks/settings"
import {getActiveDatabase} from "../services/stores/neoStore";

const Algorithms = (props) => {
  const {task} = props

  const [parameters, setParameters] = React.useState({})
  const [labelOptions, setLabelOptions] = React.useState([{ key: null, value: null, text: 'Any' }])
  const [relationshipTypeOptions, setRelationshipTypeOptions] = React.useState([{ key: "*", value: "*", text: 'Any' }])
  const [propertyKeyOptions, setPropertyKeyOptions] = React.useState([])
  const [relationshipOrientationOptions, setRelationshipOrientationOptions] = React.useState([{ key: "Natural", value: "Natural", text: 'Natural' }])

  const loadMetadata = (metadata) => {
    const labels = metadata.labels.map(row => {
      return { key: row.label, value: row.label, text: row.label }
    })
    labels.unshift({ key: "*", value: "*", text: 'Any' })
    setLabelOptions(labels)

    const relationshipTypes = metadata.relationshipTypes.map(row => {
      return { key: row.label, value: row.label, text: row.label }
    })
    relationshipTypes.unshift({ key: "*", value: "*", text: 'Any' })
    setRelationshipTypeOptions(relationshipTypes)

    setPropertyKeyOptions(metadata.propertyKeys.map(row => {
      return {key: row.propertyKey, value: row.propertyKey, text: row.propertyKey}
    }))


    setRelationshipOrientationOptions([
      {key: "Natural", value: "Natural", text: "Natural"},
      {key: "Reverse", value: "Reverse", text: "Reverse"},
      {key: "Undirected", value: "Undirected", text: "Undirected"},
    ])
  }

  React.useEffect(() => {
    loadMetadata(props.metadata)
  }, [props.metadata])

  React.useEffect(() => {
    setParameters(props.task.formParameters)
  }, [props.task.taskId])

  React.useEffect(() => {
    const {parameters} = getAlgorithmDefinitions(activeGroup, activeAlgorithm, metadata.versions.gdsVersion)
    setParameters(parameters)
  }, [JSON.stringify(props.currentAlgorithm)])

    const { activeGroup, activeAlgorithm, metadata } = props


  const onChangeParam = (key, value) =>  {
    setParameters({...parameters, [key]: value})
  }

  const onRunAlgo = () => {
    const {task} = props
    const currentAlgorithm = getAlgorithmDefinitions(task.group, task.algorithm, props.metadata.versions.gdsVersion)

    const { service, parametersBuilder } = currentAlgorithm
    if (service) {
      let formParameters = parameters;
      const params = parametersBuilder({
        ...formParameters,
        requiredProperties: Object.keys(formParameters)
      })

      const persisted = formParameters.persist
      props.onRun({ ...params, limit: props.limit, communityNodeLimit: props.communityNodeLimit }, formParameters, persisted)
    }
  }


    const currentAlgorithm = getAlgorithmDefinitions(task.group, task.algorithm, props.metadata.versions.gdsVersion)

    const { Form: AlgoForm, description, returnsCommunities } = currentAlgorithm

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

    // console.log("parameters", parameters)
    return (
        <div style={containerStyle}>
          <Card fluid style={{ boxShadow: 'none' }}>
            <Card.Content style={contentStyle}>
              <div style={{ paddingTop: '1em', paddingBottom: '1em' }}>
                <Icon name='sitemap'/>
                <Card.Header>
                  {task.algorithm}
                </Card.Header>
                <Card.Meta>{description}
                </Card.Meta>
              </div>

            </Card.Content>
            <Card.Content extra>
              <div style={{marginBottom: '1em'}}>
                <AlgoForm {...parameters} labelOptions={labelOptions}
                          relationshipTypeOptions={relationshipTypeOptions}
                          relationshipOrientationOptions={relationshipOrientationOptions}
                          propertyKeyOptions={propertyKeyOptions}
                          onChange={onChangeParam.bind(this)}/>
                <Form size='mini'>
                  <Form.Field inline>
                    <label style={{ 'width': '8em' }}>Rows to show</label>
                    <input
                      type='number'
                      placeholder="Rows"
                      min={1}
                      max={1000}
                      step={1}
                      value={parameters.limit}
                      onChange={evt => {
                        onChangeParam("limit", parseInt(evt.target.value))
                        props.updateLimit(parseInt(evt.target.value))
                      }}
                    />
                  </Form.Field>
                  {returnsCommunities ?
                      <Form.Field inline>
                        <label style={{'width': '8em'}}>Community Node Limit</label>
                        <input
                            type='number'
                            placeholder="# of nodes"
                            min={1}
                            max={1000}
                            step={1}
                            value={props.communityNodeLimit}
                            onChange={evt => {
                              onChangeParam("communityNodeLimit", parseInt(evt.target.value))
                              props.updateCommunityNodeLimit(parseInt(evt.target.value))
                            }}
                        />
                      </Form.Field> : null
                  }
                </Form>
              </div>
              <div className='ui two buttons'>
                <Button basic color='green' onClick={onRunAlgo.bind(this)}>
                  Run
                </Button>
                <Button basic color='red'>
                  Cancel
                </Button>
              </div>
            </Card.Content>
          </Card>

        </div>
      )
  }

const mapStateToProps = state => ({
  activeGroup: state.algorithms.group,
  activeAlgorithm: state.algorithms.algorithm,
  currentAlgorithm: getCurrentAlgorithm(state),
  metadata: state.metadata,
  limit: state.settings.limit,
  communityNodeLimit: state.settings.communityNodeLimit,
})

const mapDispatchToProps = dispatch => ({
  updateLimit: value => dispatch(limit(value)),
  updateCommunityNodeLimit: value => dispatch(communityNodeLimit(value)),
  addTask: (taskId, group, algorithm, parameters, persisted) => {
    const task = {
      group,
      algorithm,
      taskId,
      parameters,
      persisted,
      startTime: new Date(),
      database: getActiveDatabase()
    }
    dispatch(addTask({ ...task }))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Algorithms)
