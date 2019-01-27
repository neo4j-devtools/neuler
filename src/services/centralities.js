import { runCypher } from "./stores/neoStore"
import { v1 } from 'neo4j-driver'

export const pageRank = ({ label, relationshipType, direction, persist, writeProperty, iterations = 20, dampingFactor = 0.85 }) => {
  console.log(label, relationshipType, direction)

  const baseParameters = {
    "label": label || null,
    "relationshipType": relationshipType || null,
    "direction": direction || 'Outgoing',
    "iterations": iterations,
    "dampingFactor": dampingFactor
  }

  console.log(writeProperty)
  return runAlgorithm(pageRankStreamCypher, pageRankStoreCypher, getPageRankFetchCypher(baseParameters.label), {
      ...baseParameters,
      write: true,
      writeProperty: writeProperty || "pagerank"
    }, persist)
}

export const betweenness = ({ label, relationshipType, direction }) => {
  console.log('betweenness called', label, relationshipType, direction)

  const parameters = {
    "label": label || null,
    "relationshipType": relationshipType || null,
    "direction": direction || 'Outgoing'
  }

  return runAlgorithm(betweennessStreamCypher, parameters)
}

const handleException = error => {
  console.error(error)
  throw new Error(error)
}

const runAlgorithm = (streamCypher, storeCypher, fetchCypher, parameters, persisted) => {
  if (!persisted) {
    return runCypher(streamCypher, parameters)
      .then(result => ({rows: parseResultStream(result), query: streamCypher, parameters: parameters}))
      .catch(handleException)
  } else {
    return new Promise((resolve, reject) => {
      runCypher(storeCypher, parameters)
        .then(() => {
          runCypher(fetchCypher, {
            writeProperty: parameters.writeProperty
          })
            .then(result => resolve({rows: parseResultStream(result), query: storeCypher, parameters: parameters}))
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
        properties: Object.keys(properties).reduce((props, propKey) => {
          props[propKey] = v1.isInt(properties[propKey]) ? properties[propKey].toNumber() : properties[propKey]
          return props
        }, {}),
        labels,
        score: record.get('score')
      }
    })
  } else {
    console.error(result.error)
    throw new Error(result.error)
  }
}

const betweennessStreamCypher = `
  CALL algo.betweenness.stream($label, $relationshipType, {
     direction: $direction
    })
  YIELD nodeId, centrality

  WITH algo.getNodeById(nodeId) AS node, centrality AS score
  RETURN node, score
  ORDER BY score DESC`

const pageRankStreamCypher = `
  CALL algo.pageRank.stream($label, $relationshipType, {
    iterations: $iterations,
    dampingFactor: $dampingFactor,
    direction: $direction
    })
  YIELD nodeId, score

  WITH algo.getNodeById(nodeId) AS node, score
  RETURN node, score
  ORDER BY score DESC
  LIMIT 50`

const pageRankStoreCypher = `
  CALL algo.pageRank($label, $relationshipType, {
    iterations: $iterations,
    dampingFactor: $dampingFactor,
    direction: $direction,
    write: true,
    writeProperty: $writeProperty
    })
  `

const getPageRankFetchCypher = label => `MATCH (node${label ? ':' + label : ''})
WHERE not(node[$writeProperty] is null)
RETURN node, node[$writeProperty] AS score
ORDER BY score DESC
LIMIT 50`
