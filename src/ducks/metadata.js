const NAME = 'METADATA'

export const SET_METADATA = `${NAME}/SET_METADATA`
export const SET_LABELS = `${NAME}/SET_LABELS`
export const SET_RELATIONSHIPTYPES = `${NAME}/SET_RELATIONSHIPTYPES`
export const SET_PROPERTY_KEYS = `${NAME}/SET_PROPERTY_KEYS`
export const SET_VERSIONS = `${NAME}/SET_VERSIONS`

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

export const setVersions = version => ({
  type: SET_VERSIONS,
  version
})

const initialState = {
  labels: [],
  relationshipTypes: []
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
    case SET_VERSIONS:
      return {
        ...state,
        versions: action.version
      }
    default:
      return state
  }
}
