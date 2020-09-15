import centralityDict from '../components/Centralities/algorithmsDictionary'
import communityDict from '../components/Communities/algorithmsDictionary'

const NAME = 'SETTINGS'
const SET = `${NAME}/SET`
const LIMIT = `${NAME}/LIMIT`
const COMMUNITY_NODE_LIMIT = `${NAME}/COMMUNITY_NODE_LIMIT`
const HIDE_PROPERTY = `${NAME}/HIDE_PROPERTY`
const RESET_LABELS = `${NAME}/RESET_LABELS`

const ADD_DATABASE = `${NAME}/ADD_DATABASE`
const INIT_LABEL = `${NAME}/INIT_LABEL`
const UPDATE_LABEL_COLOR = `${NAME}/UPDATE_LABEL_COLOR`
const UPDATE_LABEL_PROPERTY_KEYS = `${NAME}/UPDATE_LABEL_PROPERTY_KEYS`

const getBlacklist = () => {
  const blacklist = new Set()

  Object.values(centralityDict.algorithmDefinitions)
    .concat(Object.values(communityDict.algorithmDefinitions))
    .forEach(definition => {
      if (definition.parameters.writeProperty) {
        blacklist.add(definition.parameters.writeProperty)
      }

      if (definition.parameters.intermediateCommunitiesWriteProperty) {
        blacklist.add(definition.parameters.intermediateCommunitiesWriteProperty)
      }
    })

  return Array.from(blacklist)
}

const getInitialState = () => {
  return {
    hiddenProperties: {
      '_ALL_NEULER_': getBlacklist()
    },
    limit: 42,
    communityNodeLimit: 10,
    labels: {
    }
  }
}

export const addDatabase = database => ({
  type: ADD_DATABASE,
  database
})

export const initLabel = (database, label, color, propertyKeys) => ({
  type: INIT_LABEL,
  database,
  label,
  color,
  propertyKeys
})

export const updateLabelColor = (database, label, color) => ({
  type: UPDATE_LABEL_COLOR,
  database,
  label,
  color
})

export const updateLabelPropertyKeys = (database, label, propertyKeys) => ({
  type: UPDATE_LABEL_PROPERTY_KEYS,
  database,
  label,
  propertyKeys
})

export const limit = limit => ({
  type: LIMIT,
  limit
})

export const communityNodeLimit = limit => ({
  type: COMMUNITY_NODE_LIMIT,
  limit
})

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

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case LIMIT:
      return {
        ...state,
        limit: action.limit
      }
    case COMMUNITY_NODE_LIMIT:
      return {
        ...state,
        communityNodeLimit: action.limit
      }
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
    case ADD_DATABASE: {
      let labels = {...state.labels}
      if (!(action.database in labels)) {
        labels[action.database] = {}
      }

      return {
        ...state,
        labels
      }
    }
    case INIT_LABEL:
      let initialLabels = {...state.labels}

      if(!(action.label in initialLabels[action.database])) {
        initialLabels[action.database][action.label] = {
          color: action.color,
          propertyKeys: action.propertyKeys
        }
      }

      return {
        ...state,
        labels: initialLabels
      }
    case UPDATE_LABEL_COLOR:
      let initLabels = {...state.labels}
      initLabels[action.database][action.label].color = action.color

      return {
        ...state,
        labels: initLabels
      }
    case UPDATE_LABEL_PROPERTY_KEYS:
      let startLabels = {...state.labels}
      startLabels[action.database][action.label].propertyKeys = action.propertyKeys

      return {
        ...state,
        labels: startLabels
      }
    default:
      return state
  }
}
