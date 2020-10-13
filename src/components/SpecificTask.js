import {useHistory, useParams} from "react-router-dom";
import {SingleTask} from "./SingleTask";
import {onRunAlgo} from "../services/tasks";
import React from "react";

export const SpecificTask = (props) => {
    const history = useHistory();
    const {tasks} = props

    const {taskId} = useParams();
    const currentTask = tasks.find(task => task.taskId === taskId)
    return <SingleTask
        metadata={props.metadata}
        onRunAlgo={onRunAlgo}
        onCopyAlgo={(group, algorithm, newParameters, formParameters) => history.push({
            pathname: '/algorithms/new',
            state: { group, algorithm, newParameters, formParameters}
        })}
        task={currentTask}
        totalPages={tasks.length}
        gdsVersion="1.3"
    />
}
