import { runCypher } from "./stores/neoStore"
import { parseProperties } from "./resultMapper"
import { communityParams } from './queries'

const baseParameters = (label, relationshipType, direction, concurrency, limit) => {
  return {
    label: label || null,
    relationshipType: relationshipType || null,
    direction: direction || 'Outgoing',
    concurrency: parseInt(concurrency) || null,
    limit: parseInt(limit) || 50
  }
}

export const executeAlgorithm = ({ streamQuery, storeQuery, label, relationshipType, direction, persist, writeProperty, weightProperty, communityProperty, intermediateCommunities, intermediateCommunitiesWriteProperty, defaultValue, concurrency, limit, requiredProperties }) => {
  const params = communityParams(label, relationshipType, direction, persist, writeProperty, weightProperty, communityProperty, intermediateCommunities, intermediateCommunitiesWriteProperty, defaultValue, concurrency, limit, requiredProperties)
  return runAlgorithm(streamQuery, storeQuery, getFetchLouvainCypher(params.label), params, persist)
}

export const lpa = ({ label, relationshipType, direction, persist, writeProperty, weightProperty, defaultValue, concurrency, limit, requiredProperties}) => {
  const params = communityParams(label, relationshipType, direction, persist, writeProperty, weightProperty, null, null, null, defaultValue, concurrency, limit, requiredProperties)
  return runAlgorithm(lpaStreamCypher, lpaStoreCypher, getNewFetchCypher(baseParameters.label), params, persist)
}

export const connectedComponents = ({ label, relationshipType, direction, persist, writeProperty, weightProperty, defaultValue, concurrency, limit, requiredProperties }) => {
  const params = communityParams(label, relationshipType, direction, persist, writeProperty, weightProperty, null, null, null, defaultValue, concurrency, limit, requiredProperties)
  return runAlgorithm(connectedComponentsStreamCypher, connectedComponentsStoreCypher, getNewFetchCypher(baseParameters.label), params, persist)
}

export const stronglyConnectedComponents = ({ label, relationshipType, direction, persist, writeProperty, weightProperty, defaultValue, concurrency, limit, requiredProperties }) => {
  const params = communityParams(label, relationshipType, direction, persist, writeProperty, weightProperty, null, null, null, defaultValue, concurrency, limit, requiredProperties)

  return runAlgorithm(stronglyConnectedComponentsStreamCypher, stronglyConnectedComponentsStoreCypher, getNewFetchCypher(baseParameters.label), params, persist)
}

export const triangles = ({ label, relationshipType, direction, writeProperty, weightProperty, defaultValue, concurrency, limit }) => {
  const baseParams = baseParameters(label, relationshipType, direction, concurrency, limit)
  const extraParams = {
    weightProperty: weightProperty || null,
    defaultValue: parseFloat(defaultValue) || 1.0,
    write: true,
    writeProperty: writeProperty || "scc"
  }

  return runStreamingAlgorithm(trianglesStreamCypher, {...baseParams, ...extraParams}, result => {
    if (result.records) {
      return result.records.map(record => {
        const nodeA = record.get('nodeA')
        const nodeB = record.get('nodeB')
        const nodeC = record.get('nodeC')

        return {
          nodeAProperties: parseProperties(nodeA.properties),
          nodeALabels: nodeA.labels,
          nodeBProperties: parseProperties(nodeB.properties),
          nodeBLabels: nodeB.labels,
          nodeCProperties: parseProperties(nodeC.properties),
          nodeCLabels: nodeC.labels,
        }
      })
    } else {
      console.error(result.error)
      throw new Error(result.error)
    }
  })
}

export const triangleCount = ({ label, relationshipType, direction, persist, writeProperty, weightProperty, defaultValue, concurrency, limit }) => {
  const baseParams = baseParameters(label, relationshipType, direction, concurrency, limit)
  const extraParams = {
    weightProperty: weightProperty || null,
    defaultValue: parseFloat(defaultValue) || 1.0,
    write: true,
    writeProperty: writeProperty || "triangles",
    clusteringCoefficientProperty: "clusteringCoefficient"
  }

  return runAlgorithm(triangleCountStreamCypher, triangleCountStoreCypher, getFetchTriangleCountCypher(baseParameters.label), {...baseParams, ...extraParams}, persist, result => {
    if (result.records) {
      return result.records.map(record => {
        const { properties, labels } = record.get('node')

        return {
          properties: parseProperties(properties),
          labels: labels,
          triangles: record.get('triangles').toNumber(),
          coefficient: record.get('coefficient'),
        }
      })
    } else {
      console.error(result.error)
      throw new Error(result.error)
    }
  })
}

export const balancedTriads = ({ label, relationshipType, direction, persist, balancedProperty, unbalancedProperty, weightProperty, defaultValue, concurrency, limit }) => {
  const baseParams = baseParameters(label, relationshipType, direction, concurrency, limit)
  const extraParams = {
    weightProperty: weightProperty || null,
    defaultValue: parseFloat(defaultValue) || 1.0,
    write: true,
    balancedProperty: balancedProperty || "balanced",
    unbalancedProperty: unbalancedProperty || "unbalanced"
  }

  return runAlgorithm(balancedTriadsStreamCypher, balancedTriadsStoreCypher, getFetchBalancedTriadsCypher(baseParameters.label), {...baseParams, ...extraParams}, persist, result => {
    if (result.records) {
      return result.records.map(record => {
        const { properties, labels } = record.get('node')

        return {
          properties: parseProperties(properties),
          labels: labels,
          balanced: record.get('balanced').toNumber(),
          unbalanced: record.get('unbalanced').toNumber(),
        }
      })
    } else {
      console.error(result.error)
      throw new Error(result.error)
    }
  })
}

const handleException = error => {
  console.error(error)
  throw new Error(error)
}

const runStreamingAlgorithm = (streamCypher, parameters, parseResultStreamFn=parseResultStream) => {
  return runCypher(streamCypher, parameters)
    .then(result => ({rows: parseResultStreamFn(result), query: streamCypher, parameters: parameters}))
    .catch(handleException)
}

const runAlgorithm = (streamCypher, storeCypher, fetchCypher, parameters, persisted, parseResultStreamFn=parseResultStream) => {
  if (!persisted) {
    return runStreamingAlgorithm(streamCypher, parameters, parseResultStreamFn)
  } else {
    return new Promise((resolve, reject) => {
      runCypher(storeCypher, parameters)
        .then(() => {
          runCypher(fetchCypher, parameters)
            .then(result => resolve({rows: parseResultStreamFn(result), query: storeCypher, parameters: parameters}))
            .catch(reject)
        })
        .catch(handleException)
    })
  }
}

export const parseResultStream = (result) => {
  if (result.records) {
    return result.records.map(record => {
      const { properties, labels } = record.get('node')
      const communities = record.has("communities") ? record.get("communities") : null
      return {
        properties: parseProperties(properties),
        labels: labels,
        community: record.get('community').toNumber(),
        communities: communities ? communities.map(value => value.toNumber()).toString() : null
      }
    })
  } else {
    console.error(result.error)
    throw new Error(result.error)
  }
}

const getNewFetchCypher = label => `MATCH (node${label ? ':' + label : ''})
WHERE not(node[$config.writeProperty] is null)
RETURN node, node[$config.writeProperty] AS community
LIMIT $limit`

const getFetchCypher = label => `MATCH (node${label ? ':' + label : ''})
WHERE not(node[$writeProperty] is null)
RETURN node, node[$writeProperty] AS community
LIMIT $limit`

const getFetchLouvainCypher = label => `MATCH (node${label ? ':' + label : ''})
WHERE not(node[$config.writeProperty] is null)
RETURN node, node[$config.writeProperty] AS community, node[$config.intermediateCommunitiesWriteProperty] as communities
LIMIT $limit`

const getFetchTriangleCountCypher = label => `MATCH (node${label ? ':' + label : ''})
WHERE not(node[$writeProperty] is null) AND not(node[$clusteringCoefficientProperty] is null)
RETURN node, node[$writeProperty] AS triangles, node[$clusteringCoefficientProperty] AS coefficient
ORDER BY triangles DESC
LIMIT $limit`

const getFetchBalancedTriadsCypher = label => `MATCH (node${label ? ':' + label : ''})
WHERE not(node[$balancedProperty] is null) AND not(node[$unbalancedProperty] is null)
RETURN node, node[$balancedProperty] AS balanced, node[$unbalancedProperty] AS unbalanced
ORDER BY balanced DESC
LIMIT $limit`

const lpaStreamCypher = `
CALL algo.labelPropagation.stream($label, $relationshipType, $config)
YIELD nodeId, label
WITH algo.getNodeById(nodeId) AS node, label AS community
RETURN node, community
ORDER BY community
LIMIT $limit`

const lpaStoreCypher = `
CALL algo.labelPropagation($label, $relationshipType, $config)`

const connectedComponentsStreamCypher = `
CALL algo.unionFind.stream($label, $relationshipType, $config)
YIELD nodeId, setId
WITH algo.getNodeById(nodeId) AS node, setId AS community
RETURN node, community
ORDER BY community
LIMIT $limit`

const connectedComponentsStoreCypher = `
CALL algo.unionFind($label, $relationshipType, $config)`

const stronglyConnectedComponentsStreamCypher = `
CALL algo.scc.stream($label, $relationshipType, $config)
YIELD nodeId, partition
WITH algo.getNodeById(nodeId) AS node, partition AS community
RETURN node, community
ORDER BY community
LIMIT $limit`

const stronglyConnectedComponentsStoreCypher = `
CALL algo.scc($label, $relationshipType, $config)`

const trianglesStreamCypher = `
  CALL algo.triangle.stream($label, $relationshipType, {
     direction: $direction
    })
  YIELD nodeA, nodeB, nodeC

  RETURN algo.getNodeById(nodeA) AS nodeA, algo.getNodeById(nodeB) AS nodeB, algo.getNodeById(nodeC) AS nodeC
  LIMIT $limit`

const triangleCountStreamCypher = `
  CALL algo.triangleCount.stream($label, $relationshipType, {
     direction: $direction
    })
  YIELD nodeId, triangles, coefficient

  WITH algo.getNodeById(nodeId) AS node, coefficient, triangles
  RETURN node, triangles, coefficient
  ORDER BY triangles DESC
  LIMIT $limit`

const triangleCountStoreCypher = `
  CALL algo.triangleCount($label, $relationshipType, {
     direction: $direction,
     write: true,
     writeProperty: $writeProperty,
     clusteringCoefficientProperty: $clusteringCoefficientProperty
    })`

const balancedTriadsStreamCypher = `
  CALL algo.balancedTriads.stream($label, $relationshipType, {
     direction: $direction
    })
  YIELD nodeId, balanced, unbalanced

  WITH algo.getNodeById(nodeId) AS node, balanced, unbalanced
  RETURN node, balanced, unbalanced
  ORDER BY balanced DESC
  LIMIT $limit`

const balancedTriadsStoreCypher = `
  CALL algo.balancedTriads($label, $relationshipType, {
     direction: $direction,
     write: true,
     balancedProperty: $balancedProperty,
     unbalancedProperty: $unbalancedProperty
    })`
