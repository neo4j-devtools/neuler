import centralitiesDictionary from './Centralities/algorithmsDictionary'
import communitiesDictionary from './Communities/algorithmsDictionary'
import pathFindingDictionary from './PathFinding/algorithmsDictionary'
import similarityDictionary from './Similarity/algorithmsDictionary'

const algorithmGroups = {
  "Centralities": centralitiesDictionary,
  "Community Detection": communitiesDictionary,
  "Path Finding": pathFindingDictionary,
  "Similarity": similarityDictionary
}

export const getAlgorithms = group => (algorithmGroups[group]  || {algorithmList: []}).algorithmList

export const getAlgorithmDefinitions = (group, algorithm) => algorithmGroups[group].algorithmDefinitions[algorithm]
