import { combineReducers } from 'redux'
import tasks from './tasks'
import algorithms from './algorithms'
import metadata from './metadata'
import connections from './connection'
import settings from './settings'

const reducers = {
  algorithms,
  tasks,
  metadata,
  connections,
  settings
}

export default combineReducers({ ...reducers })