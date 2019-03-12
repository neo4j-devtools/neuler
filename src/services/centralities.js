import { runCypher } from "./stores/neoStore"
import { v1 } from 'neo4j-driver'
import { parseProperties } from "./resultMapper"
import { streamQueryOutline, getFetchCypher, baseParameters, filterParameters } from './queries'

export const executeAlgorithm = ({ streamQuery, storeQuery, label, relationshipType, direction, persist, writeProperty, weightProperty, defaultValue, concurrency, dampingFactor, iterations, maxDepth, probability, strategy, limit, requiredProperties }) => {
  const params = baseParameters(label, relationshipType, direction, concurrency, limit)
  const config = {
    weightProperty: weightProperty,
    defaultValue: parseFloat(defaultValue),
    dampingFactor: parseFloat(dampingFactor),
    iterations: parseInt(iterations),
    maxDepth: parseInt(maxDepth) || null,
    probability: parseFloat(probability) || null,
    strategy: strategy,
    write: true,
    writeProperty: writeProperty
  }

  params.config = filterParameters({...params.config, ...config}, requiredProperties)
  return runAlgorithm(streamQuery, storeQuery, getFetchCypher(params.label), params, persist)
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
