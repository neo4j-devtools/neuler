const NAME = 'SETTINGS'
const SET = `${NAME}/SET`
const HIDE_PROPERTY = `${NAME}/HIDE_PROPERTY`

const initialState = {
  hiddenProperties: []
}

export const set = (key, value) => ({
  type: SET,
  key,
  value
})

export const hideProperty = key => ({
  type: HIDE_PROPERTY,
  key
})

export default (state = initialState, action) => {
  switch (action.type) {
    case SET:
      return {
        ...state,
        [action.key]: action.value
      }
    case HIDE_PROPERTY:
      const hiddenProperties = [...state.hiddenProperties]
      if (hiddenProperties.includes(action.key)) {
        return state
      } else {
        hiddenProperties.push(action.key)
        return {
          ...state,
          hiddenProperties
        }
      }
    default:
      return state
  }
}

