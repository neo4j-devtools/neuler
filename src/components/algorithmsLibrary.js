import centralitiesDictionary from './Centralities/algorithmsDictionary'
import communitiesDictionary from './Communities/algorithmsDictionary'
import pathFindingDictionary from './PathFinding/algorithmsDictionary'
import similarityDictionary from './Similarity/algorithmsDictionary'

export const algorithmGroups = {
  "Centralities": centralitiesDictionary,
  "Community Detection": communitiesDictionary,
  "Path Finding": pathFindingDictionary,
  "Similarity": similarityDictionary
}

export const getAlgorithms = group => (algorithmGroups[group]  || {algorithmList: []}).algorithmList

export const getAlgorithmDefinitions = (group, algorithm, gdsVersion) =>  {
  return algorithmGroups[group].algorithmDefinitions(algorithm, gdsVersion)
}



export const getGroup = algorithm => {
  const algorithmToGroup = {}
  Object.keys(algorithmGroups).forEach(group => {
    getAlgorithms(group).forEach(algorithm => {
      algorithmToGroup[algorithm] = group
    })
  })

  return algorithmToGroup[algorithm]
}
