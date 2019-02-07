const NAME = 'SETTINGS'
const SET = `${NAME}/SET`
const HIDE_PROPERTY = `${NAME}/HIDE_PROPERTY`
const RESET_LABELS = `${NAME}/RESET_LABELS`

const initialState = {
  hiddenProperties: {}
}

export const set = (key, value) => ({
  type: SET,
  key,
  value
})

export const hideProperty = (labels, key) => ({
  type: HIDE_PROPERTY,
  labels,
  key
})

export const resetLabelsProperties = labels => ({
  type: RESET_LABELS,
  labels
})

export default (state = initialState, action) => {
  switch (action.type) {
    case SET:
      return {
        ...state,
        [action.key]: action.value
      }
    case HIDE_PROPERTY:
      const hiddenPropertiesMap = { ...state.hiddenProperties }
      action.labels.forEach(label => {
        const hiddenProperties = hiddenPropertiesMap[label]

        if (hiddenProperties) {
          if (!hiddenProperties.includes(action.key)) {
            hiddenProperties.push(action.key)
          }
        } else {
          hiddenPropertiesMap[label] = [action.key]
        }
      })
      return {
        ...state,
        hiddenProperties: hiddenPropertiesMap
      }
    case RESET_LABELS:
      const hiddenProperties = { ...state.hiddenProperties }
      action.labels.forEach(label => delete hiddenProperties[label])
      return {
        ...state,
        hiddenProperties
      }
    default:
      return state
  }
}

