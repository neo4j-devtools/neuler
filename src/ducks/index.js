import { combineReducers } from 'redux'
import tasks from './tasks'
import algorithms from './algorithms'
import metadata from './metadata'
import connections from './connection'
import settings from './settings'
import menu from './menu'

const reducers = {
  algorithms,
  menu,
  tasks,
  metadata,
  connections,
  settings
}

export default combineReducers({ ...reducers })
