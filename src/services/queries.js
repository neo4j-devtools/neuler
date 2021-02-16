import {int} from "neo4j-driver"

export const streamQueryOutline = (callAlgorithm) => `${callAlgorithm}
WITH gds.util.asNode(nodeId) AS node, score
RETURN node, score
ORDER BY score DESC
LIMIT toInteger($limit)`

export const communityStreamQueryOutline = (callAlgorithm) => `${callAlgorithm}
WITH gds.util.asNode(nodeId) AS node, community
WITH collect(node) AS allNodes, community
RETURN community, allNodes[0..$communityNodeLimit] AS nodes, size(allNodes) AS size 
ORDER BY size DESC
LIMIT toInteger($limit);`

export const getFetchCypher = (label, config) => {
  const escapedLabel = config.nodeProjection && config.nodeProjection !== "*" ? ":`" + config.nodeProjection + "`" : ""
  return `MATCH (node${escapedLabel})
WHERE exists(node.\`${config.writeProperty}\`)
RETURN node, node.\`${config.writeProperty}\` AS score
ORDER BY score DESC
LIMIT toInteger($limit)`
}

export const getFetchHITSCypher = (label, config) => {
  const escapedLabel = config.nodeProjection && config.nodeProjection !== "*" ? ":`" + config.nodeProjection + "`" : ""
  return `MATCH (node${escapedLabel})
WHERE exists(node.\`${config.writeProperty}auth\`) AND exists(node.\`${config.writeProperty}hub\`)
RETURN node, node.\`${config.writeProperty}auth\` AS authScore, node.\`${config.writeProperty}hub\` AS hubScore
ORDER BY authScore DESC
LIMIT toInteger($limit)`
}

export const getFetchLouvainCypher = (label, config) => {
  const escapedLabel = config.nodeProjection && config.nodeProjection !== "*" ? ":`" + config.nodeProjection + "`" : ""
  return `MATCH (node${escapedLabel})
WHERE exists(node.\`${config.writeProperty}\`)
WITH node, node.\`${config.writeProperty}\` AS community
WITH collect(node) AS allNodes, 
     CASE WHEN apoc.meta.type(community) = "long[]" THEN community[-1] ELSE community END AS community, 
     CASE WHEN apoc.meta.type(community) = "long[]" THEN community ELSE null END as communities
RETURN community, communities, allNodes[0..$communityNodeLimit] AS nodes, size(allNodes) AS size
ORDER BY size DESC
LIMIT toInteger($limit)`
}

export const getFetchSLLPACypher = (label, config) => {
  const escapedLabel = config.nodeProjection && config.nodeProjection !== "*" ? ":`" + config.nodeProjection + "`" : ""
  return `MATCH (node${escapedLabel})
WHERE exists(node.\`${config.writeProperty}communityIds\`)
WITH node, node.\`${config.writeProperty}communityIds\` AS community
WITH collect(node) AS allNodes,  
     CASE WHEN apoc.meta.type(community) = "long[]" THEN community ELSE null END as communities
RETURN communities, allNodes[0..$communityNodeLimit] AS nodes, size(allNodes) AS size
ORDER BY size DESC
LIMIT toInteger($limit)`
}

export const getCommunityFetchCypher = (label, config) => {
  const escapedLabel = config.nodeProjection && config.nodeProjection !== "*" ? ":`" + config.nodeProjection + "`" : ""
  return `MATCH (node${escapedLabel})
WHERE exists(node.\`${config.writeProperty}\`)
WITH node.\`${config.writeProperty}\` AS community, collect(node) AS allNodes
RETURN community, allNodes[0..$communityNodeLimit] AS nodes, size(allNodes) AS size
ORDER BY size DESC
LIMIT toInteger($limit)`
}

export const getFetchTriangleCountCypher = (label, config) => {
  const escapedLabel = config.nodeProjection && config.nodeProjection !== "*" ? ":`" + config.nodeProjection + "`" : ""
  return `MATCH (node${escapedLabel})
WHERE exists(node.\`${config.writeProperty}\`)
RETURN node, node.\`${config.writeProperty}\` AS triangles
ORDER BY triangles DESC
LIMIT toInteger($limit)`
}

export const getFetchNewTriangleCountCypher = (label, config) => {
  const escapedLabel = config.nodeProjection && config.nodeProjection !== "*" ? ":`" + config.nodeProjection + "`" : ""
  return `MATCH (node${escapedLabel})
WHERE exists(node.\`${config.writeProperty}\`) 
RETURN node, node.\`${config.writeProperty}\` AS triangles
ORDER BY triangles DESC
LIMIT toInteger($limit)`
}

export const getFetchLocalClusteringCoefficientCypher = (label, config) => {
  const escapedLabel = config.nodeProjection && config.nodeProjection !== "*" ? ":`" + config.nodeProjection + "`" : ""
  return `MATCH (node${escapedLabel})
WHERE exists(node.\`${config.clusteringCoefficientProperty}\`)
RETURN node, node.\`${config.clusteringCoefficientProperty}\` AS coefficient
ORDER BY coefficient DESC
LIMIT toInteger($limit)`
}

export const getFetchNewLocalClusteringCoefficientCypher = (label, config) => {
  const escapedLabel = config.nodeProjection && config.nodeProjection !== "*" ? ":`" + config.nodeProjection + "`" : ""
  return `MATCH (node${escapedLabel})
WHERE exists(node.\`${config.writeProperty}\`)
RETURN node, node.\`${config.writeProperty}\` AS coefficient
ORDER BY coefficient DESC
LIMIT toInteger($limit)`
}



export const onePoint5PathFindingParams = ({startNode, endNode, latitudeProperty, longitudeProperty, label, relationshipType, direction, persist, writeProperty, weightProperty, clusteringCoefficientProperty, communityProperty, includeIntermediateCommunities, intermediateCommunitiesWriteProperty, defaultValue, limit, requiredProperties}) => {
  const params = {
    limit: parseInt(limit) || 50,
    config: {}
  }
  params.startNode = startNode || null
  params.endNode = endNode || null

  const parsedWeightProperty = weightProperty ? weightProperty.trim() : weightProperty
  const parsedWriteProperty = writeProperty ? writeProperty.trim() : writeProperty

  const config = {
    nodeProjection: label || "*",
    relationshipProjection: createRelationshipProjection(relationshipType, direction, weightProperty, defaultValue),
    relationshipWeightProperty: parsedWeightProperty || null,
    write: true,
    latitudeProperty: latitudeProperty,
    longitudeProperty: longitudeProperty,
  }

  if(latitudeProperty || longitudeProperty) {
    config.nodeProjection = {
      nodeLabel: {
        label: config.nodeProjection,
        properties: [latitudeProperty, longitudeProperty]
      }
    }
  }

  if (persist) {
    config.writeProperty = parsedWriteProperty
  }

  requiredProperties.push("nodeProjection")
  requiredProperties.push("relationshipProjection")

  params.config = filterParameters({...params.config, ...config}, requiredProperties)
  return params
}


export const pre1Point5PathFindingParams = ({startNode, endNode, delta, propertyKeyLat, propertyKeyLon, label, relationshipType, direction, persist, writeProperty, weightProperty, defaultValue, limit, requiredProperties}) => {
  const params = {
    limit: parseInt(limit) || 50,
    config: {}
  }
  params.startNode = startNode || null
  params.endNode = endNode || null

  const parsedWeightProperty = weightProperty ? weightProperty.trim() : weightProperty
  const parsedWriteProperty = writeProperty ? writeProperty.trim() : writeProperty

  const config = {
    nodeProjection: label || "*",
    relationshipProjection: createRelationshipProjection(relationshipType, direction, weightProperty, defaultValue),
    relationshipWeightProperty: parsedWeightProperty || null,
    write: true,
    propertyKeyLat: propertyKeyLat,
    propertyKeyLon: propertyKeyLon,
    delta: delta
  }

  if(propertyKeyLat || propertyKeyLon) {
    config.nodeProjection = {
      nodeLabel: {
        label: config.nodeProjection,
        properties: [propertyKeyLat, propertyKeyLon]
      }
    }
  }

  if (persist) {
    config.writeProperty = parsedWriteProperty
  }

  requiredProperties.push("nodeProjection")
  requiredProperties.push("relationshipProjection")

  params.config = filterParameters({...params.config, ...config}, requiredProperties)
  return params
}

const addPersistFields = (config, persist, writeProperty, writeRelationshipType) => {
  if (persist) {
    config.writeProperty = writeProperty || null
    config.writeRelationshipType = writeRelationshipType || null
  }
}

export const nodeSimilarityParams = ({label, relationshipType, direction, persist, writeProperty, defaultValue, weightProperty, writeRelationshipType, similarityCutoff, degreeCutoff, limit, requiredProperties}) => {
  const params = {
    limit: parseInt(limit) || 50,
  }

  const config = {
    similarityCutoff: parseFloat(similarityCutoff),
    degreeCutoff: degreeCutoff == null ? null : int(degreeCutoff),
    nodeProjection: label || "*",
    relationshipProjection: createRelationshipProjection(relationshipType, direction, weightProperty, defaultValue),
  }

  addPersistFields(config, persist, writeProperty, writeRelationshipType);

  requiredProperties.push("nodeProjection")
  requiredProperties.push("relationshipProjection")

  params.config = filterParameters({...params.config, ...config}, requiredProperties)
  return params
}

export const knnParams = ({label, relationshipType,  direction, persist, writeProperty, defaultValue, weightProperty, writeRelationshipType, nodeWeightProperty, topK, sampleRate,
                            deltaThreshold, randomJoins, limit, requiredProperties}) => {
  const params = {
    limit: parseInt(limit) || 50,
  }

  const config = {
    nodeProjection: label || "*",
    relationshipProjection: createRelationshipProjection(relationshipType, direction, weightProperty, defaultValue),
    nodeWeightProperty: nodeWeightProperty,
    topK: int(topK) || 10,
    randomJoins: int(randomJoins) || 10,
    sampleRate: parseFloat(sampleRate) || 0.5,
    deltaThreshold: parseFloat(deltaThreshold) || 0.001
  }

  if(nodeWeightProperty) {
    config.nodeProperties = [nodeWeightProperty]
    requiredProperties.push("nodeProperties")
  }

  addPersistFields(config, persist, writeProperty, writeRelationshipType);

  requiredProperties.push("nodeProjection")
  requiredProperties.push("relationshipProjection")

  params.config = filterParameters({...params.config, ...config}, requiredProperties)
  return params
}


export const similarityParams = ({itemLabel, relationshipType, categoryLabel, direction, persist, writeProperty, weightProperty, writeRelationshipType, similarityCutoff, degreeCutoff, limit, requiredProperties}) => {
  const params = {
    limit: parseInt(limit) || 50,
    itemLabel: itemLabel || null,
    relationshipType: relationshipType || null,
    categoryLabel: categoryLabel || null,
    weightProperty: weightProperty || null,
    config: {}
  }

  const config = {
    nodeProjection: '*',
    relationshipProjection: '*',
    writeProperty: writeProperty || null,
    writeRelationshipType: writeRelationshipType || null,
    similarityCutoff: parseFloat(similarityCutoff),
    degreeCutoff: degreeCutoff == null ? null : int(degreeCutoff),
  }

  requiredProperties.push("nodeProjection")
  requiredProperties.push("relationshipProjection")

  params.config = filterParameters({...params.config, ...config}, requiredProperties)
  return params
}

export const communityParams = ({label, relationshipType, direction, persist, maxIterations, minAssociationStrength, tolerance, writeProperty, weightProperty, clusteringCoefficientProperty, seedProperty, includeIntermediateCommunities, intermediateCommunitiesWriteProperty, defaultValue, limit, communityNodeLimit, requiredProperties}) => {
  const params = baseParameters(label, relationshipType, direction, limit, weightProperty, defaultValue)
  params.communityNodeLimit = communityNodeLimit ?  parseInt(communityNodeLimit) : 10;

  const parsedWriteProperty = writeProperty ? writeProperty.trim() : writeProperty
  const parsedIterations = maxIterations == null ? null : int(maxIterations)
  const parsedTolerance = tolerance == null ? null : parseFloat(tolerance)


  const config = {
    write: true,
    minAssociationStrength: parseFloat(minAssociationStrength) || null,
    clusteringCoefficientProperty: clusteringCoefficientProperty,
    includeIntermediateCommunities: includeIntermediateCommunities || false,
    seedProperty: seedProperty || "",
    maxIterations: parsedIterations && parsedIterations > 0 ? parsedIterations : null,
    tolerance: parsedTolerance && parsedTolerance > 0 ? parsedTolerance : null,
  }

  if(seedProperty) {
    config.nodeProperties = [seedProperty]
  }

  if (persist) {
    config.writeProperty = parsedWriteProperty
  }

  requiredProperties.push("nodeProjection")
  requiredProperties.push("relationshipProjection")
  requiredProperties.push("nodeProperties")

  params.config = filterParameters({...params.config, ...config}, requiredProperties)
  return params
}

export const centralityParams = ({label, relationshipType, direction, persist, writeProperty, weightProperty, defaultValue, dampingFactor, maxIterations, hitsIterations, maxDepth, probability, strategy, limit, normalization, requiredProperties, samplingSize}) => {
  const params = baseParameters(label, relationshipType, direction, limit, weightProperty, defaultValue)

  const parsedProbability = parseFloat(probability)
  const parsedMaxDepth = maxDepth == null ? null : int(maxDepth)
  const parsedIterations = maxIterations == null ? null : int(maxIterations)
  const parsedHitsIterations = hitsIterations == null ? null : int(hitsIterations)
  const parsedWriteProperty = writeProperty ? writeProperty.trim() : writeProperty
  const parsedSamplingSize = samplingSize == null ? null : int(samplingSize)

  const config = {
    dampingFactor: parseFloat(dampingFactor) || null,
    maxIterations: parsedIterations && parsedIterations > 0 ? parsedIterations : null,
    hitsIterations: parsedHitsIterations && parsedHitsIterations > 0 ? parsedHitsIterations : null,
    maxDepth: parsedMaxDepth && parsedMaxDepth > 0 ? parsedMaxDepth : null,
    probability: parsedProbability && parsedProbability > 0 ? parsedProbability : null,
    strategy: strategy,
    write: true,
    normalization: normalization || null,
    samplingSize: parsedSamplingSize || null
  }

  if (persist) {
    config.writeProperty = parsedWriteProperty
  }

  requiredProperties.push("nodeProjection")
  requiredProperties.push("relationshipProjection")

  params.config = filterParameters({...params.config, ...config}, requiredProperties)
  return params
}

export const embeddingParams = ({label, relationshipType, direction, persist, writeProperty, weightProperty, defaultValue, limit, requiredProperties, iterations, embeddingDimension, walkLength, inOutFactor, returnFactor}) => {
  const params = baseParameters(label, relationshipType, direction, limit, weightProperty, defaultValue)
  const parsedWriteProperty = writeProperty ? writeProperty.trim() : writeProperty

  const parsedIterations = iterations == null ? null : int(iterations)
  const parsedEmbeddingDimension = embeddingDimension == null ? null : int(embeddingDimension)
  const parsedWalkLength = walkLength == null ? null : int(walkLength)
  const parsedInoutFactor = parseFloat(inOutFactor)
  const parsedReturnFactor = parseFloat(returnFactor)

  const config = {
    write: true,
    iterations: parsedIterations && parsedIterations > 0 ? parsedIterations : null,
    embeddingDimension: parsedEmbeddingDimension && parsedEmbeddingDimension > 0 ? parsedEmbeddingDimension : null,
    walkLength: parsedWalkLength && parsedWalkLength > 0 ? parsedWalkLength : null,
    inOutFactor: parsedInoutFactor && parsedInoutFactor > 0 ? parsedInoutFactor : null,
    returnFactor: parsedReturnFactor && parsedReturnFactor > 0 ? parsedReturnFactor : null,
  }

  if (persist) {
    config.writeProperty = parsedWriteProperty
  }

  requiredProperties.push("nodeProjection")
  requiredProperties.push("relationshipProjection")

  params.config = filterParameters({...params.config, ...config}, requiredProperties)
  return params
}

export const createRelationshipProjection = (relationshipType, direction, weightProperty, defaultValue) => {
  const relTypeKey = "relType"
  return (relationshipType === null || relationshipType === undefined) ? {
      [relTypeKey]: {
        type: "*",
        orientation: (direction === null || direction === undefined) ? "NATURAL" : direction.toUpperCase()
      }
    }
    : {
      [relTypeKey]: {
        type: relationshipType,
        orientation: (direction === null || direction === undefined) ? "NATURAL" : direction.toUpperCase(),
        properties: !weightProperty ? {} : {
          [weightProperty]: {property: weightProperty, defaultValue: parseFloat(defaultValue) || null},
        }
      }
    }
}

export const baseParameters = (label, relationshipType, direction, limit, weightProperty, defaultValue) => {
  const parsedWeightProperty = weightProperty ? weightProperty.trim() : weightProperty

  return {
    limit: parseInt(limit) || 50,
    config: {
      nodeProjection: label || "*",
      relationshipProjection: createRelationshipProjection(relationshipType, direction, weightProperty, defaultValue),
      relationshipWeightProperty: parsedWeightProperty || null
    }
  }
}

export const filterParameters = (raw, allowed) => {
  return Object.keys(raw)
    .filter(key => allowed.includes(key))
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: raw[key]
      };
    }, {});
}
