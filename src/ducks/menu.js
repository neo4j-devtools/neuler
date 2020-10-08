const NAME = 'MENU'
const SELECT_MENU_ITEM = `${NAME}/SELECT_MENU_ITEM`

export const selectMenuItem = item => ({
  type: SELECT_MENU_ITEM,
  item: item
})


const initialState = {
  item: 'Home',
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SELECT_MENU_ITEM:
      return {
        item: action.item
      }
    default:
      return state
  }
}
