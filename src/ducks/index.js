import { combineReducers } from 'redux'
import tasks from './tasks'
import algorithms from './algorithms'

const reducers = {
  algorithms,
  tasks
}

export default combineReducers({ ...reducers })