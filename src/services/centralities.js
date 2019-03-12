import { runCypher } from "./stores/neoStore"
import { v1 } from 'neo4j-driver'
import { parseProperties } from "./resultMapper"
import { streamQueryOutline } from './queries'

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

export const executeAlgorithm = ({ streamQuery, storeQuery, label, relationshipType, direction, persist, writeProperty, weightProperty, defaultValue, concurrency, dampingFactor, iterations, limit, requiredProperties }) => {
  const params = baseParameters(label, relationshipType, direction, concurrency, limit)
  const config = {
    weightProperty: weightProperty || null,
    defaultValue: parseFloat(defaultValue) || 1.0,
    dampingFactor: parseFloat(dampingFactor),
    iterations: parseInt(iterations),
    write: true,
    writeProperty: writeProperty || "degree"
  }

const raw = {...params.config, ...config}
  params.config = filterMap(raw, requiredProperties)

  return runAlgorithm(streamQuery, storeQuery, getFetchCypher(params.label), params, persist)
}

const filterMap = (raw, allowed) => {
  return Object.keys(raw)
  .filter(key => allowed.includes(key))
  .reduce((obj, key) => {
    return {
      ...obj,
      [key]: raw[key]
    };
  }, {});
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



const betweennessStreamCypher = streamQueryOutline(`
CALL algo.betweenness.stream($label, $relationshipType, $config)
YIELD nodeId, centrality AS score`)

const betweennessStoreCypher = `
CALL algo.betweenness($label, $relationshipType, $config)`

const closenessStreamCypher = streamQueryOutline(`
CALL algo.closeness.stream($label, $relationshipType, $config)
YIELD nodeId, centrality AS score`)

const closenessStoreCypher = `
CALL algo.closeness($label, $relationshipType, $config)`

const harmonicStreamCypher = streamQueryOutline(`
CALL algo.closeness.harmonic.stream($label, $relationshipType, $config)
YIELD nodeId, centrality AS score`)

const harmonicStoreCypher = `
CALL algo.closeness.harmonic($label, $relationshipType, $config)`

const approxBetweennessStreamCypher = streamQueryOutline(`
CALL algo.betweenness.sampled.stream($label, $relationshipType, $config)
YIELD nodeId, centrality AS score`)

const approxBetweennessStoreCypher = `
CALL algo.betweenness.sampled($label, $relationshipType, $config)`

const getFetchCypher = label => `MATCH (node${label ? ':' + label : ''})
WHERE not(node[$config.writeProperty] is null)
RETURN node, node[$config.writeProperty] AS score
ORDER BY score DESC
LIMIT $limit`
