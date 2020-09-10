import React from 'react'
import {connect} from 'react-redux'
import {Button} from 'semantic-ui-react'
import {getAlgorithmDefinitions} from "./algorithmsLibrary"
import {getCurrentAlgorithm} from "../ducks/algorithms"
import {communityNodeLimit, limit} from "../ducks/settings"
import {ResultsFiltering} from "./Form/ResultsFiltering";
import {ADDED} from "../ducks/tasks";

const AlgoForm = (props) => {
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

  const onCopyAlgo = () => {
    const {task} = props
    const currentAlgorithm = getAlgorithmDefinitions(task.group, task.algorithm, props.metadata.versions.gdsVersion)

    const { service, parametersBuilder } = currentAlgorithm
    if (service) {
      let formParameters = parameters;
      const params = parametersBuilder({
        ...formParameters,
        requiredProperties: Object.keys(formParameters)
      })

      props.onCopy(task.group, task.algorithm, { ...params, limit: props.limit, communityNodeLimit: props.communityNodeLimit }, formParameters)
    }
  }

  const currentAlgorithm = getAlgorithmDefinitions(task.group, task.algorithm, props.metadata.versions.gdsVersion)
  const {Form: AlgoForm, returnsCommunities} = currentAlgorithm

  const containerStyle = {
    overflow: 'hidden',
    height: '100%',
    marginRight: '0'
  }

  const updateLimit = (evt, data) => {
    onChangeParam("limit", parseInt(data.value))
    props.updateLimit(parseInt(data.value))
  }

  const updateCommunityNodeLimit = (evt, data) => {
    onChangeParam("communityNodeLimit", parseInt(data.value))
    props.updateCommunityNodeLimit(parseInt(data.value))
  }

  const readOnly = task.status !== ADDED;
  return (
      <div style={containerStyle}>
        <div style={{marginBottom: '1em'}}>
          <AlgoForm {...parameters} labelOptions={labelOptions}
                    relationshipTypeOptions={relationshipTypeOptions}
                    relationshipOrientationOptions={relationshipOrientationOptions}
                    propertyKeyOptions={propertyKeyOptions}
                    readOnly={readOnly}
                    onChange={onChangeParam.bind(this)}/>
          <ResultsFiltering limit={parameters.limit}
                            communityNodeLimit={parameters.communityNodeLimit}
                            readOnly={readOnly}
                            returnsCommunities={returnsCommunities}
                            updateLimit={updateLimit}
                            updateCommunityNodeLimit={updateCommunityNodeLimit}/>
        </div>
        <div>
            {task.status === ADDED && <Button color='green' onClick={onRunAlgo}>Run Algorithm</Button>}

            {task.status !== ADDED && task.completed &&
            <Button.Group>
                <Button title="Run the algorithm again with the same parameters" color='green' onClick={onRunAlgo}>Re-run Algorithm</Button>
                <Button.Or/>
                <Button title="Make a copy of the algorithm with parameters pre-populated" color='blue' onClick={onCopyAlgo}>Make a copy</Button>
            </Button.Group>
            }

            {task.status !== ADDED && !task.completed && <Button disabled color='green' onClick={onRunAlgo}>Run Algorithm</Button>}

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

export default connect(mapStateToProps, mapDispatchToProps)(AlgoForm)
