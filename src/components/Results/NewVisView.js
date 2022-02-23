import React from "react";
import {tabContentStyle} from "../AlgoResults";
import NewGraphVisualiser from "../visualisation/NewGraphVisualiser";

export const NewVisView = ({task, active}) => (
    <div style={tabContentStyle}>
        <NewGraphVisualiser taskId={task.taskId} results={task.result} label={task.parameters.graphConfig.nodeProjection}
                         active={active}
                         algorithm={task.algorithm}
                         limit={task.parameters.limit}
                         relationshipType={task.parameters.graphConfig.relationshipProjection.relType.type}
                         writeProperty={(task.parameters.config || {}).writeProperty}
                         group={task.group}/>
    </div>
)
