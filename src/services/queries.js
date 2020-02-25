import { v1 as neo } from "neo4j-driver"

export const streamQueryOutline = (callAlgorithm) => `${callAlgorithm}
WITH gds.util.asNode(nodeId) AS node, score
RETURN node, score
ORDER BY score DESC
LIMIT $limit
`

export const communityStreamQueryOutline = (callAlgorithm) => `${callAlgorithm}
WITH gds.util.asNode(nodeId) AS node, community
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


export const pathFindingParams = ({startNodeId, startNode, endNodeId, endNode, delta, propertyKeyLat, propertyKeyLon, label, relationshipType, direction, persist, writeProperty, weightProperty, clusteringCoefficientProperty, communityProperty, includeIntermediateCommunities, intermediateCommunitiesWriteProperty, defaultValue, concurrency, limit, requiredProperties}) => {
  const params = {
    limit: parseInt(limit) || 50,
    config: {
      concurrency: parseInt(concurrency) || null
    }
  }

  params.startNodeId = parseInt(startNodeId)
  params.endNodeId = parseInt(endNodeId)
  params.startNode = startNode || null
  params.endNode = endNode || null

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

export const similarityParams = ({itemLabel, relationshipType, categoryLabel, direction, persist, writeProperty, weightProperty, writeRelationshipType, similarityCutoff, degreeCutoff, concurrency, limit, requiredProperties}) => {
  const params = {
    limit: parseInt(limit) || 50,
    itemLabel: itemLabel || null,
    relationshipType: relationshipType || null,
    categoryLabel: categoryLabel || null,
    weightProperty: weightProperty || null,
    config: {
      concurrency: parseInt(concurrency) || null,
    }
  }

  const config = {
    writeProperty: writeProperty || null,
    writeRelationshipType: writeRelationshipType || null,
    similarityCutoff: parseFloat(similarityCutoff),
    degreeCutoff: parseInt(degreeCutoff),
    write: persist,
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
  const params = baseParameters(label, relationshipType, direction, concurrency, limit, weightProperty)

  const parsedProbability = parseFloat(probability)
  const parsedMaxDepth = parseInt(maxDepth)
  const parsedIterations = parseInt(iterations)
  const parsedWeightProperty = weightProperty ? weightProperty.trim() : weightProperty
  const parsedWriteProperty = writeProperty ? writeProperty.trim() : writeProperty

  const config = {
    // defaultValue: parseFloat(defaultValue) || null,
    dampingFactor: parseFloat(dampingFactor) || null,
    iterations: parsedIterations && parsedIterations > 0 ? parsedIterations : null,
    maxDepth: parsedMaxDepth && parsedMaxDepth > 0 ? parsedMaxDepth : null,
    probability: parsedProbability && parsedProbability > 0 ? parsedProbability : null,
    strategy: strategy,
    write: true,
    writeProperty: parsedWriteProperty || null,
    normalization: normalization || null
  }

  requiredProperties.push("nodeProjection")
  requiredProperties.push("relationshipProjection")

  params.config = filterParameters({...params.config, ...config}, requiredProperties)
  return params
}


export const baseParameters = (label, relationshipType, direction, concurrency, limit, weightProperty) => {
  const allowedDirections = ["Incoming", "Outgoing", "Both"]

  const parsedWeightProperty = weightProperty ? weightProperty.trim() : weightProperty

  return {
    limit: parseInt(limit) || 50,
    config: {
      nodeProjection: label || null,
      relationshipProjection: relationshipType == null ? null :  {
        [relationshipType]: {
          type: relationshipType,
          projection: direction == null ? "NATURAL" : direction.toUpperCase(),
          properties: weightProperty == null ? {} : {
            [weightProperty]: {property: weightProperty}
          }
        }
      },
      relationshipWeightProperty: parsedWeightProperty || null,
      concurrency: concurrency == null ? null : neo.int(concurrency),
      // direction: direction && allowedDirections.includes(direction) ? direction : 'Outgoing'
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
