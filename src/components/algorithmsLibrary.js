import centralitiesDictionary from './Centralities/algorithmsDictionary'
import communitiesDictionary from './Communities/algorithmsDictionary'

const algorithmGroups = {
  "Centralities": centralitiesDictionary,
  "Community Detection": communitiesDictionary
}

export const getAlgorithms = group => algorithmGroups[group].algorithmList

export const getAlgorithmDefinitions = (group, algorithm) => algorithmGroups[group].algorithmDefinitions[algorithm]
