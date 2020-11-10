import centralityDict from '../components/Centralities/algorithmsDictionary'
import communityDict from '../components/Communities/algorithmsDictionary'

const NAME = 'SETTINGS'
const SET = `${NAME}/SET`
const LIMIT = `${NAME}/LIMIT`
const COMMUNITY_NODE_LIMIT = `${NAME}/COMMUNITY_NODE_LIMIT`
const HIDE_PROPERTY = `${NAME}/HIDE_PROPERTY`
const RESET_LABELS = `${NAME}/RESET_LABELS`

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
    default:
      return state
  }
}
