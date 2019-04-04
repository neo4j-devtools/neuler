import { runCypher } from "./stores/neoStore"
import { parseProperties } from "./resultMapper"
import {communityParams, getFetchLouvainCypher} from './queries'

const baseParameters = (label, relationshipType, direction, concurrency, limit) => {
  return {
    label: label || null,
    relationshipType: relationshipType || null,
    direction: direction || 'Outgoing',
    concurrency: parseInt(concurrency) || null,
    limit: parseInt(limit) || 50
  }
}


export const runAlgorithm = ({streamCypher, storeCypher, fetchCypher, parameters, persisted, parseResultStreamFn=parseResultStream}) => {
  if (!persisted) {
    return runStreamingAlgorithm(streamCypher, parameters, parseResultStreamFn)
  } else {
    return new Promise((resolve, reject) => {
      runCypher(storeCypher, parameters)
          .then(() => {
            runCypher(fetchCypher, parameters)
                .then(result => resolve(parseResultStreamFn(result)))
                .catch(reject)
          })
          .catch(handleException)
    })
  }
}

export const triangles = ({streamCypher, parameters}) => {
  return runStreamingAlgorithm(streamCypher, parameters, result => {
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

export const triangleCount = ({streamCypher, storeCypher, fetchCypher, parameters, persisted }) => {
  return runAlgorithm({streamCypher, storeCypher, fetchCypher, parameters, persisted, parseResultStreamFn: result => {
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
  }})
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

      .then(result => parseResultStreamFn(result))
      .catch(handleException)
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

const getFetchBalancedTriadsCypher = label => `MATCH (node${label ? ':' + label : ''})
WHERE not(node[$balancedProperty] is null) AND not(node[$unbalancedProperty] is null)
RETURN node, node[$balancedProperty] AS balanced, node[$unbalancedProperty] AS unbalanced
ORDER BY balanced DESC
LIMIT $limit`

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
