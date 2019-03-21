const NAME = 'DASHBOARD'
const ADD_ITEM = `${NAME}/ADD_ITEM`
const COMPLETE_ITEM = `${NAME}/COMPLETE_ITEM`

export const addItem = (id, name, mode, result) => ({
  type: ADD_ITEM,
  id,
  name,
  mode,
  result
})

export const completeItem = (id, result) => ({
  type: COMPLETE_ITEM,
  id,
  result
})

const initialState = {
  items: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_ITEM:
      return {
        ...state,
        items: state.items.concat({
          id: action.id,
          name: action.name,
          mode: action.mode,
          startTime: new Date()
        })
      }
    case COMPLETE_ITEM:
      const items = [...state.items]
      const item = items.find(item => item.id === action.id)
      if (item) {
        item.result = action.result.rows
        item.completed = true
        return {
          ...state,
          items
        }
      } else {
        return state
      }
    default:
      return state
  }
}