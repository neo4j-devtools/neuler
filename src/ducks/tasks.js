const NAME = 'TASKS'
const ADD_TASK = `${NAME}/ADD_TASK`
const COMPLETE_TASK = `${NAME}/COMPLETE_TASK`

export const addTask = ({taskId, algorithm, startTime, parameters}) => ({
  type: ADD_TASK,
  taskId,
  algorithm,
  startTime,
  parameters
})

export const completeTask = ({taskId, result}) => ({
  type: COMPLETE_TASK,
  taskId,
  result
})

export default (state = [], action) => {
  switch (action.type) {
    case ADD_TASK:
      return state.concat([{
        taskId: action.taskId,
        algorithm: action.algorithm,
        startTime: action.startTime,
        result: action.result,
        parameters: action.parameters,
        completed: false
      }])
    case COMPLETE_TASK:
      const tasks = [...state]
      const task = tasks.find(task => task.taskId === action.taskId)
      if (task) {
        task.result = action.result
        task.completed = true
        return tasks
      } else {
        return state
      }
    default:
      return state
  }

  return state
}