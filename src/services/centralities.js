import { runCypher } from "./stores/neoStore"

export const pageRank = ({ label, relationshipType, direction, iterations = 20, dampingFactor = 0.85 }) => {
  console.log(label, relationshipType, direction)

  const parameters = {
    "label": label || null,
    "relationshipType": relationshipType || null,
    "direction": direction || 'Outgoing',
    "iterations": iterations,
    "dampingFactor": dampingFactor
  }

  return runAlgorithm(pageRankStreamCypher, parameters)
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

const runAlgorithm = (cypher, parameters) =>
  runCypher(cypher, parameters)
    .then(result => {
      if (result.records) {
        return result.records.map(record => {
          const { properties, labels } = record.get('node')
          return {
            properties,
            labels,
            score: record.get('score')
          }
        })
      } else {
        console.error(result.error)
        throw new Error(result.error)
      }
    })
    .catch(error => {
      console.error(error)
    })

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
  ORDER BY score DESC`
