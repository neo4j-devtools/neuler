import { runCypher } from "./stores/neoStore"

export const pageRank = ({ label, relationshipType, direction, iterations = 20, dampingFactor = 0.85 }) => {
  console.log(label, relationshipType, direction)

  const params = {
    "label": label || null,
    "relationshipType": relationshipType || null,
    "direction": direction || 'Outgoing',
    "iterations": iterations,
    "dampingFactor": dampingFactor
  }

  return runCypher(pageRankStreamCypher, params)
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
}

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
