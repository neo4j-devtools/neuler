const NAME = 'connection'

export const SET_STATUS = `${NAME}/SET_STATUS`
export const SET_CREDENTIALS = `${NAME}/SET_CREDENTIALS`
export const SET_CONNECTED = `${NAME}/SET_CONNECTED`
export const SET_DISCONNECTED = `${NAME}/SET_DISCONNECTED`

export const INITIAL = 'INITIAL'
export const CONNECTING = 'CONNECTING'
export const CONNECTED = 'CONNECTED'
export const DISCONNECTED = 'DISCONNECTED'

export const setStatus = status => ({
  type: SET_STATUS,
  status
})

export const setCredentials = credentials => ({
  type: SET_CREDENTIALS,
  credentials
})

export const setConnected = credentials => ({
  type: SET_CONNECTED,
  credentials
})

export const setDisconnected = () => ({
  type: SET_DISCONNECTED
})

const initialState = {
  status: INITIAL,
  credentials: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_STATUS:
      return {
        ...state,
        status: action.status
      }
    case SET_CREDENTIALS:
      return {
        ...state,
        credentials: action.credentials
      }
    case SET_CONNECTED:
      return {
        status: CONNECTED,
        credentials: action.credentials
      }
    case SET_DISCONNECTED:
      return {
        status: DISCONNECTED,
        credentials: null
      }
    default:
      return state
  }
}