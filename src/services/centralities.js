import { runCypher } from "./stores/neoStore"
import { v1 } from 'neo4j-driver'
import { parseProperties } from "./resultMapper"

const baseParameters = (label, relationshipType, direction, concurrency) => {
  return {
    label: label || null,
    relationshipType: relationshipType || null,
    direction: direction || 'Outgoing',
    concurrency: parseInt(concurrency) || null
  }
}

export const pageRank = ({ label, relationshipType, direction, persist, writeProperty, weightProperty, defaultValue, concurrency, iterations, dampingFactor }) => {
  const baseParams = baseParameters(label, relationshipType, direction, concurrency)
  const extraParams = {
    iterations: parseInt(iterations) || 20,
    dampingFactor: parseFloat(dampingFactor) || 0.85,
    weightProperty: weightProperty || null,
    defaultValue: parseFloat(defaultValue) || 1.0,
    write: true,
    writeProperty: writeProperty || "pagerank"
  }

  return runAlgorithm(pageRankStreamCypher, pageRankStoreCypher, getFetchCypher(baseParameters.label),
                      {...baseParams, ...extraParams}, persist)
}

export const articleRank = ({ label, relationshipType, direction, persist, writeProperty, weightProperty, defaultValue, concurrency, iterations, dampingFactor }) => {
  const baseParams = baseParameters(label, relationshipType, direction, concurrency)
  const extraParams = {
    iterations: parseInt(iterations) || 20,
    dampingFactor: parseFloat(dampingFactor) || 0.85,
    weightProperty: weightProperty || null,
    defaultValue: parseFloat(defaultValue) || 1.0,
    write: true,
    writeProperty: writeProperty || "articlerank"
  }

  return runAlgorithm(articleRankStreamCypher, articleRankStoreCypher, getFetchCypher(baseParameters.label),
                      {...baseParams, ...extraParams}, persist)
}

export const betweenness = ({ label, relationshipType, direction, concurrency, persist, writeProperty }) => {
  const baseParams = baseParameters(label, relationshipType, direction, concurrency)
  const extraParams = {
    write: true,
    writeProperty: writeProperty || "betweenness"
  }

  return runAlgorithm(betweennessStreamCypher, betweennessStoreCypher, getFetchCypher(baseParameters.label),
                      {...baseParams, ...extraParams}, persist)
}

export const approxBetweenness = ({ label, relationshipType, direction, concurrency, persist, writeProperty, maxDepth, probability, strategy }) => {
  const baseParams = baseParameters(label, relationshipType, direction, concurrency)
  const extraParams = {
    write: true,
    writeProperty: writeProperty || "approxBetweenness",
    maxDepth: parseInt(maxDepth) || null,
    probability: parseFloat(probability) || null,
    strategy: strategy || null
  }

  return runAlgorithm(approxBetweennessStreamCypher, approxBetweennessStoreCypher, getFetchCypher(baseParameters.label),
                      {...baseParams, ...extraParams}, persist)
}

export const closeness = ({ label, relationshipType, direction, concurrency, persist, writeProperty }) => {
  const baseParams = baseParameters(label, relationshipType, direction, concurrency)
  const extraParams = {
    write: true,
    writeProperty: writeProperty || "closeness"
  }

  return runAlgorithm(closenessStreamCypher, closenessStoreCypher, getFetchCypher(baseParameters.label),
                      {...baseParams, ...extraParams}, persist)
}

export const harmonic = ({ label, relationshipType, direction, concurrency, persist, writeProperty }) => {
  const baseParams = baseParameters(label, relationshipType, direction, concurrency)
  const extraParams = {
    write: true,
    writeProperty: writeProperty || "harmonic"
  }

  return runAlgorithm(harmonicStreamCypher, harmonicStoreCypher, getFetchCypher(baseParameters.label),
                      {...baseParams, ...extraParams}, persist)
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
        properties: parseProperties(properties),
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
  ORDER BY score DESC
  LIMIT 50`

const betweennessStoreCypher = `
  CALL algo.betweenness($label, $relationshipType, {
     direction: $direction,
     write: true,
     writeProperty: $writeProperty
    })`

const closenessStreamCypher = `
  CALL algo.closeness.stream($label, $relationshipType, {
     direction: $direction
    })
  YIELD nodeId, centrality

  WITH algo.getNodeById(nodeId) AS node, centrality AS score
  RETURN node, score
  ORDER BY score DESC
  LIMIT 50`

const closenessStoreCypher = `
  CALL algo.closeness($label, $relationshipType, {
     direction: $direction,
     write: true,
     writeProperty: $writeProperty
    })`

const harmonicStreamCypher = `
  CALL algo.closeness.harmonic.stream($label, $relationshipType, {
     direction: $direction
    })
  YIELD nodeId, centrality

  WITH algo.getNodeById(nodeId) AS node, centrality AS score
  RETURN node, score
  ORDER BY score DESC
  LIMIT 50`

const harmonicStoreCypher = `
  CALL algo.closeness.harmonic($label, $relationshipType, {
     direction: $direction,
     write: true,
     writeProperty: $writeProperty
    })`

const approxBetweennessStreamCypher = `
  CALL algo.betweenness.sampled.stream($label, $relationshipType, {
     direction: $direction,
     maxDepth: $maxDepth,
     probability: $probability,
     strategy: $strategy
    })
  YIELD nodeId, centrality

  WITH algo.getNodeById(nodeId) AS node, centrality AS score
  RETURN node, score
  ORDER BY score DESC
  LIMIT 50`

const approxBetweennessStoreCypher = `
  CALL algo.betweenness.sampled($label, $relationshipType, {
     direction: $direction,
     write: true,
     writeProperty: $writeProperty,
     maxDepth: $maxDepth,
     probability: $probability,
     strategy: $strategy
    })`

const pageRankStreamCypher = `CALL algo.pageRank.stream($label, $relationshipType, {
  iterations: $iterations,
  dampingFactor: $dampingFactor,
  direction: $direction,
  weightProperty: $weightProperty,
  defaultValue: $defaultValue,
  concurrency: $concurrency
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
    concurrency: $concurrency,
    direction: $direction,
    write: true,
    writeProperty: $writeProperty,
    weightProperty: $weightProperty,
    defaultValue: $defaultValue,
    concurrency: $concurrency
    })
  `

const articleRankStreamCypher = `
  CALL algo.articleRank.stream($label, $relationshipType, {
    iterations: $iterations,
    dampingFactor: $dampingFactor,
    direction: $direction,
    weightProperty: $weightProperty,
    defaultValue: $defaultValue,
    concurrency: $concurrency
    })
  YIELD nodeId, score

  WITH algo.getNodeById(nodeId) AS node, score
  RETURN node, score
  ORDER BY score DESC
  LIMIT 50`

const articleRankStoreCypher = `
  CALL algo.articleRank($label, $relationshipType, {
    iterations: $iterations,
    dampingFactor: $dampingFactor,
    concurrency: $concurrency,
    direction: $direction,
    write: true,
    writeProperty: $writeProperty,
    weightProperty: $weightProperty,
    defaultValue: $defaultValue,
    concurrency: $concurrency
    })
  `


const getFetchCypher = label => `MATCH (node${label ? ':' + label : ''})
WHERE not(node[$writeProperty] is null)
RETURN node, node[$writeProperty] AS score
ORDER BY score DESC
LIMIT 50`
