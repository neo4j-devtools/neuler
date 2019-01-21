import { combineReducers } from 'redux'
import tasks from './tasks'

const reducers = {
  tasks
}

export default combineReducers({ ...reducers })