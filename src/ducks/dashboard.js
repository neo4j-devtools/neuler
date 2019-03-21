const NAME = 'DASHBOARD'
const ADD_ITEM = `${NAME}/ADD_ITEM`
const COMPLETE_ITEM = `${NAME}/COMPLETE_ITEM`

export const addItem = (name, mode, result) => ({
  type: ADD_ITEM,
  name,
  mode,
  result
})

export const completeItem = (name, result) => ({
  type: COMPLETE_ITEM,
  name,
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
          name: action.name,
          mode: action.mode
        })
      }
    case COMPLETE_ITEM:
      const items = [...state.items]
      const item = items.find(items => items.name === action.name)
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