import centralitiesDictionary from './Centralities/algorithmsDictionary'
import communitiesDictionary from './Communities/algorithmsDictionary'

const algorithmGroups = {
  "Centralities": centralitiesDictionary,
  "Community Detection": communitiesDictionary,
  "Path Finding": communitiesDictionary
}

export const getAlgorithms = group => (algorithmGroups[group]  || {algorithmList: []}).algorithmList

export const getAlgorithmDefinitions = (group, algorithm) => algorithmGroups[group].algorithmDefinitions[algorithm]
