import { getAlgorithmDefinitions, getAlgorithms } from "../components/algorithmsLibrary"

const NAME = 'ALGORITHMS'
const SELECT_GROUP = `${NAME}/SELECT_GROUP`
const SELECT_ALGORITHM = `${NAME}/SELECT_ALGORITHM`

export const selectGroup = (group, gdsVersion) => ({
  type: SELECT_GROUP,
  group,
  gdsVersion
})

export const selectAlgorithm = algorithm => ({
  type: SELECT_ALGORITHM,
  algorithm
})

const initialState = {
  group: 'Home',
  algorithm: ''
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SELECT_GROUP:
      return {
        algorithm: getAlgorithms(action.group, action.gdsVersion)[0],
        group: action.group
      }
    case SELECT_ALGORITHM:
      return {
        ...state,
        algorithm: action.algorithm
      }
    default:
      return state
  }
}
