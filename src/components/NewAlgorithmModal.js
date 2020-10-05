import React from "react";
import {getActiveDatabase} from "../services/stores/neoStore";
import {Modal} from "semantic-ui-react";
import AlgorithmForm from "./AlgorithmForm";
import {connect} from "react-redux";
import {getCurrentAlgorithm} from "../ducks/algorithms";
import {addTask, runTask} from "../ducks/tasks";

export const NewAlgorithmModal = (props) => {
    const {activeGroup, activeAlgorithm, metadata, open, setOpen, task} = props

    const addLimits = (params) => {
        return {
            ...params,
            limit: props.limit,
            communityNodeLimit: props.communityNodeLimit
        }
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
                    props.addTask(task.taskId, activeGroup, activeAlgorithm, addLimits(newParameters), formParameters, persisted)
                    props.onRunAlgo(task, newParameters, formParameters, persisted)
                    setOpen(false)
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
