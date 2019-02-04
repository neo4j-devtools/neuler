const NAME = 'METADATA'

export const SET_METADATA = `${NAME}/SET_METADATA`
export const SET_LABELS = `${NAME}/SET_LABELS`
export const SET_RELATIONSHIPTYPES = `${NAME}/SET_RELATIONSHIPTYPES`

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
    default:
      return state
  }
}
