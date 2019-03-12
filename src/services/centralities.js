import { runCypher } from "./stores/neoStore"
import { v1 } from 'neo4j-driver'
import { parseProperties } from "./resultMapper"

const baseParameters = (label, relationshipType, direction, concurrency, limit) => {
  return {
    label: label || null,
    relationshipType: relationshipType || null,
    limit: parseInt(limit) || 50,
    config: {
      concurrency: parseInt(concurrency) || null,
      direction: direction || 'Outgoing'
    }
  }
}

export const degree = ({ label, relationshipType, direction, persist, writeProperty, weightProperty, defaultValue, concurrency, dampingFactor, limit }) => {
  const baseParams = baseParameters(label, relationshipType, direction, concurrency, limit)
  const extraParams = {
    weightProperty: weightProperty || null,
    defaultValue: parseFloat(defaultValue) || 1.0,
    write: true,
    writeProperty: writeProperty || "degree"
  }

  const params = baseParams
  params.config = {...baseParams.config, ...extraParams}

  return runAlgorithm(degreeStreamCypher, degreeStoreCypher, getFetchCypher(params.label), params, persist)
}

export const pageRank = ({ label, relationshipType, direction, persist, writeProperty, weightProperty, defaultValue, concurrency, iterations, dampingFactor, limit }) => {
  const baseParams = baseParameters(label, relationshipType, direction, concurrency, limit)
  const extraParams = {
    iterations: parseInt(iterations) || 20,
    dampingFactor: parseFloat(dampingFactor) || 0.85,
    weightProperty: weightProperty || null,
    defaultValue: parseFloat(defaultValue) || 1.0,
    write: true,
    writeProperty: writeProperty || "pagerank"
  }

  const params = baseParams
  params.config = {...baseParams.config, ...extraParams}

  return runAlgorithm(pageRankStreamCypher, pageRankStoreCypher, getFetchCypher(params.label), params, persist)
}

export const articleRank = ({ label, relationshipType, direction, persist, writeProperty, weightProperty, defaultValue, concurrency, iterations, dampingFactor, limit }) => {
  const baseParams = baseParameters(label, relationshipType, direction, concurrency, limit)
  const extraParams = {
    iterations: parseInt(iterations) || 20,
    dampingFactor: parseFloat(dampingFactor) || 0.85,
    weightProperty: weightProperty || null,
    defaultValue: parseFloat(defaultValue) || 1.0,
    write: true,
    writeProperty: writeProperty || "articlerank"
  }

  const params = baseParams
  params.config = {...baseParams.config, ...extraParams}

  return runAlgorithm(articleRankStreamCypher, articleRankStoreCypher, getFetchCypher(params.label), params, persist)
}

export const betweenness = ({ label, relationshipType, direction, concurrency, persist, writeProperty, limit }) => {
  const baseParams = baseParameters(label, relationshipType, direction, concurrency, limit)
  const extraParams = {
    write: true,
    writeProperty: writeProperty || "betweenness"
  }

  const params = baseParams
  params.config = {...baseParams.config, ...extraParams}

  return runAlgorithm(betweennessStreamCypher, betweennessStoreCypher, getFetchCypher(params.label), params, persist)
}

export const approxBetweenness = ({ label, relationshipType, direction, concurrency, persist, writeProperty, maxDepth, probability, strategy, limit }) => {
  const baseParams = baseParameters(label, relationshipType, direction, concurrency, limit)
  const extraParams = {
    write: true,
    writeProperty: writeProperty || "approxBetweenness",
    maxDepth: parseInt(maxDepth) || null,
    probability: parseFloat(probability) || null,
    strategy: strategy || null
  }

  const params = baseParams
  params.config = {...baseParams.config, ...extraParams}

  return runAlgorithm(approxBetweennessStreamCypher, approxBetweennessStoreCypher, getFetchCypher(params.label), params, persist)
}

export const closeness = ({ label, relationshipType, direction, concurrency, persist, writeProperty, limit }) => {
  const baseParams = baseParameters(label, relationshipType, direction, concurrency, limit)
  const extraParams = {
    write: true,
    writeProperty: writeProperty || "closeness"
  }

  const params = baseParams
  params.config = {...baseParams.config, ...extraParams}

  return runAlgorithm(closenessStreamCypher, closenessStoreCypher, getFetchCypher(params.label), params, persist)
}

export const harmonic = ({ label, relationshipType, direction, concurrency, persist, writeProperty, limit }) => {
  const baseParams = baseParameters(label, relationshipType, direction, concurrency, limit)
  const extraParams = {
    write: true,
    writeProperty: writeProperty || "harmonic"
  }

  const params = baseParams
  params.config = {...baseParams.config, ...extraParams}

  return runAlgorithm(harmonicStreamCypher, harmonicStoreCypher, getFetchCypher(params.label), params, persist)
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
          runCypher(fetchCypher, parameters)
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
CALL algo.betweenness.stream($label, $relationshipType, $config)
YIELD nodeId, centrality
WITH algo.getNodeById(nodeId) AS node, centrality AS score
RETURN node, score
ORDER BY score DESC
LIMIT $limit`

const betweennessStoreCypher = `
CALL algo.betweenness($label, $relationshipType, $config)`

const closenessStreamCypher = `
CALL algo.closeness.stream($label, $relationshipType, $config)
YIELD nodeId, centrality
WITH algo.getNodeById(nodeId) AS node, centrality AS score
RETURN node, score
ORDER BY score DESC
LIMIT $limit`

const closenessStoreCypher = `
CALL algo.closeness($label, $relationshipType, $config)`

const harmonicStreamCypher = `
CALL algo.closeness.harmonic.stream($label, $relationshipType, $config)
YIELD nodeId, centrality

WITH algo.getNodeById(nodeId) AS node, centrality AS score
RETURN node, score
ORDER BY score DESC
LIMIT $limit`

const harmonicStoreCypher = `
CALL algo.closeness.harmonic($label, $relationshipType, $config)`

const approxBetweennessStreamCypher = `
CALL algo.betweenness.sampled.stream($label, $relationshipType, $config)
YIELD nodeId, centrality

WITH algo.getNodeById(nodeId) AS node, centrality AS score
RETURN node, score
ORDER BY score DESC
LIMIT $limit`

const approxBetweennessStoreCypher = `
CALL algo.betweenness.sampled($label, $relationshipType, $config)`

const pageRankStreamCypher = `
CALL algo.pageRank.stream($label, $relationshipType, $config)
YIELD nodeId, score
WITH algo.getNodeById(nodeId) AS node, score
RETURN node, score
ORDER BY score DESC
LIMIT $limit`

const pageRankStoreCypher = `
CALL algo.pageRank($label, $relationshipType, $config)
`

const degreeStreamCypher = `
CALL algo.degree.stream($label, $relationshipType, $config)
YIELD nodeId, score

WITH algo.getNodeById(nodeId) AS node, score
RETURN node, score
ORDER BY score DESC
LIMIT $limit`

const degreeStoreCypher = `
CALL algo.degree($label, $relationshipType, $config)
`

const articleRankStreamCypher = `
CALL algo.articleRank.stream($label, $relationshipType, $config)
YIELD nodeId, score
WITH algo.getNodeById(nodeId) AS node, score
RETURN node, score
ORDER BY score DESC
LIMIT $limit`

const articleRankStoreCypher = `
CALL algo.articleRank($label, $relationshipType, $config)
`

const getFetchCypher = label => `MATCH (node${label ? ':' + label : ''})
WHERE not(node[$config.writeProperty] is null)
RETURN node, node[$config.writeProperty] AS score
ORDER BY score DESC
LIMIT $limit`
