import { combineReducers } from 'redux'
import tasks from './tasks'
import algorithms from './algorithms'
import metadata from './metadata'
import connections from './connection'

const reducers = {
  algorithms,
  tasks,
  metadata,
  connections
}

export default combineReducers({ ...reducers })