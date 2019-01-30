import { runCypher } from "./stores/neoStore"
import { v1 } from 'neo4j-driver'

const baseParameters = (label, relationshipType, direction, concurrency) => {
  return {
    label: label || null,
    relationshipType: relationshipType || null,
    direction: direction || 'Outgoing',
    concurrency: parseInt(concurrency) || null
  }
}

export const louvain = ({ label, relationshipType, direction, persist, writeProperty, weightProperty, defaultValue, concurrency }) => {
  const baseParams = baseParameters(label, relationshipType, direction, concurrency)
  const extraParams = {
    weightProperty: weightProperty || null,
    defaultValue: parseFloat(defaultValue) || 1.0,
    write: true,
    writeProperty: writeProperty || "louvain"
  }

  return runAlgorithm(louvainStreamCypher, louvainStoreCypher, getFetchCypher(baseParameters.label),
                      {...baseParams, ...extraParams}, persist)
}

export const lpa = ({ label, relationshipType, direction, persist, writeProperty, weightProperty, defaultValue, concurrency }) => {
  const baseParams = baseParameters(label, relationshipType, direction, concurrency)
  const extraParams = {
    weightProperty: weightProperty || null,
    defaultValue: parseFloat(defaultValue) || 1.0,
    write: true,
    writeProperty: writeProperty || "lpa"
  }

  return runAlgorithm(lpaStreamCypher, lpaStoreCypher, getFetchCypher(baseParameters.label),
                      {...baseParams, ...extraParams}, persist)
}

export const connectedComponents = ({ label, relationshipType, direction, persist, writeProperty, weightProperty, defaultValue, concurrency }) => {
  const baseParams = baseParameters(label, relationshipType, direction, concurrency)
  const extraParams = {
    weightProperty: weightProperty || null,
    defaultValue: parseFloat(defaultValue) || 1.0,
    write: true,
    writeProperty: writeProperty || "connectedComponents"
  }

  return runAlgorithm(connectedComponentsStreamCypher, connectedComponentsStoreCypher, getFetchCypher(baseParameters.label),
                      {...baseParams, ...extraParams}, persist)
}

export const stronglyConnectedComponents = ({ label, relationshipType, direction, persist, writeProperty, weightProperty, defaultValue, concurrency }) => {
  const baseParams = baseParameters(label, relationshipType, direction, concurrency)
  const extraParams = {
    weightProperty: weightProperty || null,
    defaultValue: parseFloat(defaultValue) || 1.0,
    write: true,
    writeProperty: writeProperty || "scc"
  }

  return runAlgorithm(stronglyConnectedComponentsStreamCypher, stronglyConnectedComponentsStoreCypher, getFetchCypher(baseParameters.label),
                      {...baseParams, ...extraParams}, persist)
}

export const triangles = ({ label, relationshipType, direction, writeProperty, weightProperty, defaultValue, concurrency }) => {
  const baseParams = baseParameters(label, relationshipType, direction, concurrency)
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

export const triangleCount = ({ label, relationshipType, direction, persist, writeProperty, weightProperty, defaultValue, concurrency }) => {
  const baseParams = baseParameters(label, relationshipType, direction, concurrency)
  const extraParams = {
    weightProperty: weightProperty || null,
    defaultValue: parseFloat(defaultValue) || 1.0,
    write: true,
    writeProperty: writeProperty || "triangles",
    clusteringCoefficientProperty: "clusteringCoefficient"
  }

  return runAlgorithm(triangleCountStreamCypher, triangleCountStoreCypher, getFetchCypher(baseParameters.label), {...baseParams, ...extraParams}, persist, result => {
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

export const parseProperties = (properties) => {
  return Object.keys(properties).reduce((props, propKey) => {
    props[propKey] = v1.isInt(properties[propKey]) ? properties[propKey].toNumber() : properties[propKey]
    return props
  }, {})
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
          runCypher(fetchCypher, {
            writeProperty: parameters.writeProperty
          })
            .then(result => resolve({rows: parseResultStreamFn(result), query: storeCypher, parameters: parameters}))
            .catch(reject)
        })
        .catch(handleException)
    })
  }
}

const parseResultStream = result => {
  if (result.records) {
    return result.records.map(record => {
      const { properties, labels } = record.get('node')

      return {
        properties: parseProperties(properties),
        labels: labels,
        community: record.get('community').toNumber()
      }
    })
  } else {
    console.error(result.error)
    throw new Error(result.error)
  }
}

const getFetchCypher = label => `MATCH (node${label ? ':' + label : ''})
WHERE not(node[$writeProperty] is null)
RETURN node, node[$writeProperty] AS community
LIMIT 50`

const louvainStreamCypher = `
  CALL algo.louvain.stream($label, $relationshipType, {
     direction: $direction
    })
  YIELD nodeId, community

  WITH algo.getNodeById(nodeId) AS node, community AS community
  RETURN node, community
  ORDER BY community
  LIMIT 50`

const louvainStoreCypher = `
  CALL algo.louvain($label, $relationshipType, {
     direction: $direction,
     write: true,
     writeProperty: $writeProperty
    })`

const lpaStreamCypher = `
  CALL algo.labelPropagation.stream($label, $relationshipType, {
     direction: $direction
    })
  YIELD nodeId, label

  WITH algo.getNodeById(nodeId) AS node, label AS community
  RETURN node, community
  ORDER BY community
  LIMIT 50`

const lpaStoreCypher = `
  CALL algo.labelPropagation($label, $relationshipType, $direction, {
     direction: $direction,
     write: true,
     partitionProperty: $writeProperty
    })`

const connectedComponentsStreamCypher = `
  CALL algo.unionFind.stream($label, $relationshipType, {
     direction: $direction
    })
  YIELD nodeId, setId

  WITH algo.getNodeById(nodeId) AS node, setId AS community
  RETURN node, community
  ORDER BY community
  LIMIT 50`

const connectedComponentsStoreCypher = `
  CALL algo.unionFind($label, $relationshipType, $direction, {
     direction: $direction,
     write: true,
     partitionProperty: $writeProperty
    })`

const stronglyConnectedComponentsStreamCypher = `
  CALL algo.scc.stream($label, $relationshipType, {
     direction: $direction
    })
  YIELD nodeId, partition

  WITH algo.getNodeById(nodeId) AS node, partition AS community
  RETURN node, community
  ORDER BY community
  LIMIT 50`

const stronglyConnectedComponentsStoreCypher = `
  CALL algo.scc($label, $relationshipType, $direction, {
     direction: $direction,
     write: true,
     partitionProperty: $writeProperty
    })`

const trianglesStreamCypher = `
  CALL algo.triangle.stream($label, $relationshipType, {
     direction: $direction
    })
  YIELD nodeA, nodeB, nodeC

  RETURN algo.getNodeById(nodeA) AS nodeA, algo.getNodeById(nodeB) AS nodeB, algo.getNodeById(nodeC) AS nodeC
  LIMIT 50`

const triangleCountStreamCypher = `
  CALL algo.triangleCount.stream($label, $relationshipType, {
     direction: $direction
    })
  YIELD nodeId, triangles, coefficient

  WITH algo.getNodeById(nodeId) AS node, coefficient, triangles
  RETURN node, triangles, coefficient
  ORDER BY triangles DESC
  LIMIT 50`

const triangleCountStoreCypher = `
  CALL algo.triangleCount($label, $relationshipType, $direction, {
     direction: $direction,
     write: true,
     writeProperty: $writeProperty,
     clusteringCoefficientProperty: $writeProperty
    })`
