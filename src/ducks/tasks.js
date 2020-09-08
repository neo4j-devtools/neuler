const NAME = 'TASKS'
const ADD_TASK = `${NAME}/ADD_TASK`
const RUN_TASK = `${NAME}/RUN_TASK`
const COMPLETE_TASK = `${NAME}/COMPLETE_TASK`

export const ADDED = 'ADDED'
export const RUNNING = 'RUNNING'
export const COMPLETED = 'COMPLETED'
export const FAILED = 'FAILED'

export const addTask = ({taskId, group, algorithm, startTime, parameters, formParameters, query, persisted, database}) => ({
  type: ADD_TASK,
  taskId,
  group,
  algorithm,
  startTime,
  parameters,
  formParameters,
  persisted,
  database
})

export const runTask = ({taskId, query, namedGraphQueries, parameters, formParameters, persisted}) => ({
  type: RUN_TASK,
  taskId,
  query,
  namedGraphQueries,
  parameters,
  formParameters,
  persisted
})

export const completeTask = ({taskId, result, error}) => ({
  type: COMPLETE_TASK,
  taskId,
  result,
  error
})

export default (state = [], action) => {
  switch (action.type) {
    case ADD_TASK:
      const newState = [...state]
      newState.unshift({
        taskId: action.taskId,
        group: action.group,
        algorithm: action.algorithm,
        startTime: action.startTime,
        result: action.result,
        parameters: action.parameters,
        formParameters: action.formParameters,
        status: ADDED,
        completed: false,
        persisted: action.persisted,
        database: action.database
      })
      return newState
    case RUN_TASK:
      const existingTasks = [...state]
      const theTask = existingTasks.find(task => task.taskId === action.taskId)
      if (theTask) {
        theTask.status = RUNNING
        theTask.query = action.query
        theTask.namedGraphQueries = action.namedGraphQueries
        theTask.parameters = action.parameters
        theTask.formParameters = action.formParameters
        theTask.persisted = action.persisted
        return existingTasks
      } else {
        return state
      }
    case COMPLETE_TASK:
      const tasks = [...state]
      const task = tasks.find(task => task.taskId === action.taskId)
      if (task) {
        if (action.error) {
          task.error = action.error
          task.status = FAILED
        } else{
          task.status = COMPLETED
          task.result = action.result
        }

        task.completed = true
        return tasks
      } else {
        return state
      }
    default:
      return state
  }
}
