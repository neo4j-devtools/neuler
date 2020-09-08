import {getAlgorithmDefinitions} from "../algorithmsLibrary";
import NodeLabel from "../NodeLabel";
import React from "react";
import {tabContentStyle} from "../AlgoResults";

export const TableView = ({task, gdsVersion}) => {
    const {ResultView} = getAlgorithmDefinitions(task.group, task.algorithm, gdsVersion)

    const labels = task.result ? task.result.labels : []

    return <div style={tabContentStyle}>
        {labels.length > 0 ? <div style={{display: "flex"}}>
            {labels.map(label => <NodeLabel key={label} labels={[label]} caption={label} database={task.database}/>)}
        </div> : null}

        <ResultView task={task}/>
    </div>
}