export const streamQueryOutline = (callAlgorithm) => `${callAlgorithm}
WITH algo.getNodeById(nodeId) AS node, score
RETURN node, score
ORDER BY score DESC
LIMIT $limit
`

export const communityStreamQueryOutline = (callAlgorithm) => `${callAlgorithm}
WITH algo.getNodeById(nodeId) AS node, community
RETURN node, community
ORDER BY community DESC
LIMIT $limit
`

export const getFetchCypher = label => `MATCH (node${label ? ':' + label : ''})
WHERE not(node[$config.writeProperty] is null)
RETURN node, node[$config.writeProperty] AS score
ORDER BY score DESC
LIMIT $limit`

export const getFetchLouvainCypher = label => `MATCH (node${label ? ':' + label : ''})
WHERE not(node[$config.writeProperty] is null)
RETURN node, node[$config.writeProperty] AS community, node[$config.intermediateCommunitiesWriteProperty] as communities
LIMIT $limit`

export const getCommunityFetchCypher = label => `MATCH (node${label ? ':' + label : ''})
WHERE not(node[$config.writeProperty] is null)
RETURN node, node[$config.writeProperty] AS community
LIMIT $limit`

export const getFetchTriangleCountCypher = label => `MATCH (node${label ? ':' + label : ''})
WHERE not(node[$config.writeProperty] is null) AND not(node[$config.clusteringCoefficientProperty] is null)
RETURN node, node[$config.writeProperty] AS triangles, node[$config.clusteringCoefficientProperty] AS coefficient
ORDER BY triangles DESC
LIMIT $limit`


export const pathFindingParams = ({startNodeId, endNodeId, delta, propertyKeyLat, propertyKeyLon, label, relationshipType, direction, persist, writeProperty, weightProperty, clusteringCoefficientProperty, communityProperty, includeIntermediateCommunities, intermediateCommunitiesWriteProperty, defaultValue, concurrency, limit, requiredProperties}) => {
  const params = baseParameters(label, relationshipType, direction, concurrency, limit)
  params.startNodeId = parseInt(startNodeId)
  params.endNodeId = parseInt(endNodeId)

  const parsedWeightProperty = weightProperty ? weightProperty.trim() : weightProperty
  const parsedWriteProperty = writeProperty ? writeProperty.trim() : writeProperty

  const config = {
    nodeQuery: label || null,
    relationshipQuery: relationshipType || null,
    weightProperty: parsedWeightProperty || null,
    defaultValue: parseFloat(defaultValue) || 1.0,
    write: true,
    writeProperty: parsedWriteProperty || null,
    propertyKeyLat: propertyKeyLat,
    propertyKeyLon: propertyKeyLon,
    delta: delta

  }

  params.config = filterParameters({...params.config, ...config}, requiredProperties)
  return params
}

export const communityParams = ({label, relationshipType, direction, persist, writeProperty, weightProperty, clusteringCoefficientProperty, communityProperty, includeIntermediateCommunities, intermediateCommunitiesWriteProperty, defaultValue, concurrency, limit, requiredProperties}) => {
  const params = baseParameters(label, relationshipType, direction, concurrency, limit)

  const parsedWeightProperty = weightProperty ? weightProperty.trim() : weightProperty
  const parsedWriteProperty = writeProperty ? writeProperty.trim() : writeProperty

  const config = {
    weightProperty: parsedWeightProperty || null,
    defaultValue: parseFloat(defaultValue) || 1.0,
    write: true,
    writeProperty: parsedWriteProperty || null,
    clusteringCoefficientProperty: clusteringCoefficientProperty,
    includeIntermediateCommunities: includeIntermediateCommunities || false,
    intermediateCommunitiesWriteProperty: intermediateCommunitiesWriteProperty || null,
    communityProperty: communityProperty || ""
  }

  params.config = filterParameters({...params.config, ...config}, requiredProperties)
  return params
}

export const centralityParams = ({label, relationshipType, direction, writeProperty, weightProperty, defaultValue, concurrency, dampingFactor, iterations, maxDepth, probability, strategy, limit, normalization, requiredProperties}) => {
  const params = baseParameters(label, relationshipType, direction, concurrency, limit)

  const parsedProbability = parseFloat(probability)
  const parsedMaxDepth = parseInt(maxDepth)
  const parsedIterations =  parseInt(iterations)
  const parsedWeightProperty = weightProperty ? weightProperty.trim() : weightProperty
  const parsedWriteProperty = writeProperty ? writeProperty.trim() : writeProperty

  const config = {
    weightProperty: parsedWeightProperty || null,
    defaultValue: parseFloat(defaultValue) || null,
    dampingFactor: parseFloat(dampingFactor) || null,
    iterations: parsedIterations && parsedIterations > 0 ? parsedIterations : null,
    maxDepth: parsedMaxDepth && parsedMaxDepth > 0 ? parsedMaxDepth : null,
    probability: parsedProbability && parsedProbability > 0 ? parsedProbability : null,
    strategy: strategy,
    write: true,
    writeProperty: parsedWriteProperty || null,
    normalization: normalization || null
  }

  params.config = filterParameters({...params.config, ...config}, requiredProperties)
  return params
}


export const baseParameters = (label, relationshipType, direction, concurrency, limit) => {
  const allowedDirections = ["Incoming", "Outgoing", "Both"]

  return {
    label: label || null,
    relationshipType: relationshipType || null,
    limit: parseInt(limit) || 50,
    config: {
      concurrency: parseInt(concurrency) || null,
      direction: direction && allowedDirections.includes(direction) ? direction : 'Outgoing'
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
