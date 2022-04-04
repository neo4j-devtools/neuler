import centralitiesDictionary from './Centralities/algorithmsDictionary'
import communitiesDictionary from './Communities/algorithmsDictionary'
import embeddingsDictionary from './GraphEmbeddings/algorithmsDictionary'
import pathFindingDictionary from './PathFinding/algorithmsDictionary'
import similarityDictionary from './Similarity/algorithmsDictionary'

export const algorithmGroups = (gdsVersion) => {
    const version = parseInt(gdsVersion.split(".")[1])

    const commonCategories = {
        "Centralities": centralitiesDictionary,
        "Community Detection": communitiesDictionary,
        "Path Finding": pathFindingDictionary,
        "Similarity": similarityDictionary,
        "Graph Embeddings": embeddingsDictionary
    };

    return commonCategories
}

export const getAlgorithms = (group, gdsVersion) => {
    return (algorithmGroups(gdsVersion)[group] || {algorithmList: () => []}).algorithmList(gdsVersion)
}

export const getAlgorithmDefinitions = (group, algorithm, gdsVersion) => {
    return algorithmGroups(gdsVersion)[group].algorithmDefinitions(algorithm, gdsVersion)
}


export const getGroup = (algorithm, gdsVersion) => {
    const algorithmToGroup = {}
    Object.keys(algorithmGroups(gdsVersion)).forEach(group => {
        getAlgorithms(group, gdsVersion || "1.4.0").forEach(algorithm => {
            algorithmToGroup[algorithm] = group
        })
    })

    return algorithmToGroup[algorithm]
}
