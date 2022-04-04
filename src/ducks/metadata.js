const NAME = 'METADATA'

export const SET_METADATA = `${NAME}/SET_METADATA`
export const SET_LABELS = `${NAME}/SET_LABELS`
export const SET_RELATIONSHIPTYPES = `${NAME}/SET_RELATIONSHIPTYPES`
export const SET_PROPERTY_KEYS = `${NAME}/SET_PROPERTY_KEYS`
export const SET_NODE_PROPERTY_KEYS = `${NAME}/SET_NODE_PROPERTY_KEYS`
export const SET_REL_PROPERTY_KEYS = `${NAME}/SET_REL_PROPERTY_KEYS`
export const SET_VERSIONS = `${NAME}/SET_VERSIONS`
export const SET_DATABASES = `${NAME}/SET_DATABASES`
export const SET_ACTIVE_DATABASE = `${NAME}/SET_ACTIVE_DATABASE`

const ADD_DATABASE = `${NAME}/ADD_DATABASE`
const INIT_LABEL = `${NAME}/INIT_LABEL`
const UPDATE_LABEL_COLOR = `${NAME}/UPDATE_LABEL_COLOR`
const UPDATE_LABEL_PROPERTY_KEYS = `${NAME}/UPDATE_LABEL_PROPERTY_KEYS`

export const setMetadata = (labels, relationshipTypes) => ({
  type: SET_METADATA,
  labels,
  relationshipTypes
})

export const setLabels = labels => ({
  type: SET_LABELS,
  labels
})

export const setRelationshipTypes = relationshipTypes => ({
  type: SET_RELATIONSHIPTYPES,
  relationshipTypes
})

export const setPropertyKeys = propertyKeys => ({
  type: SET_PROPERTY_KEYS,
  propertyKeys: propertyKeys
})

export const setNodePropertyKeys = nodePropertyKeys => ({
  type: SET_NODE_PROPERTY_KEYS,
  nodePropertyKeys: nodePropertyKeys
})

export const setRelPropertyKeys = relPropertyKeys => ({
  type: SET_REL_PROPERTY_KEYS,
  relPropertyKeys: relPropertyKeys
})

export const setVersions = version => ({
  type: SET_VERSIONS,
  version
})

export const setDatabases = databases => ({
  type: SET_DATABASES,
  databases
})

export const setActiveDatabase = activeDatabase => ({
  type: SET_ACTIVE_DATABASE,
  activeDatabase
})

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

const initialState = {
  labels: [],
  relationshipTypes: [],
  databases: [],
  activeDatabase: "neo4j",
  allLabels: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_METADATA:
      return {
        labels: action.labels,
        relationshipTypes: action.relationshipTypes
      }
    case SET_LABELS:
      return {
        ...state,
        labels: action.labels
      }
    case SET_RELATIONSHIPTYPES:
      return {
        ...state,
        relationshipTypes: action.relationshipTypes
      }
    case SET_PROPERTY_KEYS:
      return {
        ...state,
        propertyKeys: action.propertyKeys
      }
    case SET_NODE_PROPERTY_KEYS:
      return {
        ...state,
        nodePropertyKeys: action.nodePropertyKeys
      }
    case SET_REL_PROPERTY_KEYS:
      return {
        ...state,
        relPropertyKeys: action.relPropertyKeys
      }
    case SET_VERSIONS:
      return {
        ...state,
        versions: action.version
      }
    case SET_DATABASES:
      return {
        ...state,
        databases: action.databases
      }
    case SET_ACTIVE_DATABASE:
      return {
        ...state,
        activeDatabase: action.activeDatabase
      }
    case ADD_DATABASE: {
      let allLabels = {...state.allLabels}
      if (!(action.database in allLabels)) {
        allLabels[action.database] = {}
      }

      return {
        ...state,
        allLabels
      }
    }
    case INIT_LABEL:
      let initialLabels = {...state.allLabels}

      if(!(action.label in initialLabels[action.database])) {
        initialLabels[action.database][action.label] = {
          color: action.color,
          propertyKeys: action.propertyKeys
        }
      }

      return {
        ...state,
        allLabels: initialLabels
      }
    case UPDATE_LABEL_COLOR:
      let initLabels = {...state.allLabels}
      initLabels[action.database][action.label].color = action.color

      return {
        ...state,
        allLabels: initLabels
      }
    case UPDATE_LABEL_PROPERTY_KEYS:
      let startLabels = {...state.allLabels}
      startLabels[action.database][action.label].propertyKeys = action.propertyKeys

      return {
        ...state,
        allLabels: startLabels
      }
    default:
      return state
  }
}
