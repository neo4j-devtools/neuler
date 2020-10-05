import React from "react";
import {v4 as generateTaskId} from "uuid";
import {getActiveDatabase} from "../services/stores/neoStore";
import {Modal} from "semantic-ui-react";
import AlgorithmForm from "./AlgorithmForm";
import {getAlgorithmDefinitions} from "./algorithmsLibrary";
import {connect} from "react-redux";
import {getCurrentAlgorithm} from "../ducks/algorithms";
import {ADDED, addTask, runTask} from "../ducks/tasks";

export const NewAlgorithmModal = (props) => {
    const {activeGroup, activeAlgorithm, metadata, open, setOpen} = props

    const taskId = generateTaskId()
    const addLimits = (params) => {
        return {
            ...params,
            limit: props.limit,
            communityNodeLimit: props.communityNodeLimit
        }
    }
    console.log("activeGroup", activeGroup, "activeAlgorithm", activeAlgorithm, "version", metadata.versions.gdsVersion)
    const {parameters} = getAlgorithmDefinitions(activeGroup, activeAlgorithm, metadata.versions.gdsVersion)
    const {parametersBuilder} = props.currentAlgorithm

    const params = parametersBuilder({
        ...parameters,
        requiredProperties: Object.keys(parameters)
    })

    const formParameters = addLimits(parameters);

    const task = {
        group: activeGroup,
        algorithm: activeAlgorithm,
        taskId,
        parameters: params,
        formParameters,
        persisted: parameters.persist,
        startTime: new Date(),
        database: getActiveDatabase(),
        status: ADDED
    }

    return <Modal open={open} size="large"  onClose={() => {
        setOpen(false);
    }} closeIcon centered={false}>
        <Modal.Header>
            Select and configure algorithm
        </Modal.Header>
        <Modal.Content>
            <AlgorithmForm
                task={task}
                onRun={(newParameters, formParameters, persisted) => {
                    props.addTask(taskId, activeGroup, activeAlgorithm, addLimits(params), formParameters, persisted)
                    props.onRunAlgo(task, newParameters, formParameters, persisted)
                }}
                onCopy={() => {}}
            />
        </Modal.Content>
    </Modal>
}

const mapStateToProps = state => ({
    tasks: state.tasks,
    limit: state.settings.limit,
    metadata: state.metadata,
    activeGroup: state.algorithms.group,
    activeAlgorithm: state.algorithms.algorithm,
    currentAlgorithm: getCurrentAlgorithm(state),
    communityNodeLimit: state.settings.communityNodeLimit,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    runTask: (taskId, query, namedGraphQueries, parameters, formParameters, persisted) => {
        dispatch(runTask({ taskId, query, namedGraphQueries, parameters, formParameters, persisted }))
    },
    addTask: (taskId, group, algorithm, parameters, formParameters, persisted) => {
        const task = {
            group,
            algorithm,
            taskId,
            parameters,
            formParameters,
            persisted,
            startTime: new Date(),
            database: getActiveDatabase()
        }
        dispatch(addTask({ ...task }))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(NewAlgorithmModal)
