import React from 'react'
import {connect} from 'react-redux'
import {Button, Card, Form, Icon} from 'semantic-ui-react'
import {getAlgorithmDefinitions} from "./algorithmsLibrary"
import {getCurrentAlgorithm} from "../ducks/algorithms"
import {communityNodeLimit, limit} from "../ducks/settings"
import {ResultsFiltering} from "./Form/ResultsFiltering";

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
      overflow: 'hidden',
      height: '100%',
      marginRight: '0'
    }

    const contentStyle = {
      display: 'flex',
      padding: '0 0 0 1em'
    }

  const updateLimit = (evt) => {
    onChangeParam("limit", parseInt(evt.target.value))
    props.updateLimit(parseInt(evt.target.value))
  }

  const updateCommunityNodeLimit = (evt) => {
    onChangeParam("communityNodeLimit", parseInt(evt.target.value))
    props.updateCommunityNodeLimit(parseInt(evt.target.value))
  }

    console.log("parameters", parameters, "props.task.formParameters", props.task.formParameters)
    return (
        <div style={containerStyle}>
              <div style={{marginBottom: '1em'}}>
                <AlgoForm {...parameters} labelOptions={labelOptions}
                          relationshipTypeOptions={relationshipTypeOptions}
                          relationshipOrientationOptions={relationshipOrientationOptions}
                          propertyKeyOptions={propertyKeyOptions}
                          onChange={onChangeParam.bind(this)}/>
                <ResultsFiltering limit={parameters.limit}
                                  communityNodeLimit={parameters.communityNodeLimit}
                                  returnsCommunities={returnsCommunities}
                                  updateLimit={updateLimit}
                                  updateCommunityNodeLimit={updateCommunityNodeLimit} />
              </div>
              <div className='ui two buttons'>
                <Button basic color='green' onClick={onRunAlgo.bind(this)}>
                  Run
                </Button>
                <Button basic color='red'>
                  Reset
                </Button>
              </div>

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
})

export default connect(mapStateToProps, mapDispatchToProps)(Algorithms)
