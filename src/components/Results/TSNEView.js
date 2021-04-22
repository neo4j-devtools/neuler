import React from "react"
import { tabContentStyle } from "../AlgoResults"
import TSNEVisualizer from "../visualisation/TSNEVisualizer"

export function TSNEView({ task, active }) {
  const { taskId, result, completed } = task

  return (
    <div style={tabContentStyle}>
      {active && (
        <TSNEVisualizer taskId={taskId} result={result} completed={completed} />
      )}
    </div>
  )
}