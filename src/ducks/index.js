import { combineReducers } from 'redux'
import tasks from './tasks'
import algorithms from './algorithms'
import metadata from './metadata'

const reducers = {
  algorithms,
  tasks,
  metadata
}

export default combineReducers({ ...reducers })