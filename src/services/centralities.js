import { runCypher } from "./stores/neoStore"

export const pageRank = ({ label, relationshipType, iterations = 20, dampingFactor = 0.85 }) => {
  console.log(label, relationshipType)
  const cypher = getCypher({ iterations, dampingFactor })

  const params = {
    "label": label || null,
    "relationshipType": relationshipType || null,
    "iterations": iterations,
    "dampingFactor": dampingFactor
  }

  return runCypher(cypher, params)
    .then(result => {
      if (result.records) {
        return result.records.map(record => ({
          name: record.get('name'),
          score: record.get('score')
        }))
      } else {
        console.error(result.error)
        throw new Error(result.error)
      }
    })
    .catch(error => {
      console.error(error)
    })
}

const getCypher = ({ relationshipType, iterations, dampingFactor }) =>
  `CALL algo.pageRank.stream($label, $relationshipType, {iterations: $iterations, dampingFactor: $dampingFactor})
  YIELD nodeId, score
  RETURN algo.getNodeById(nodeId).name AS name, score
  ORDER BY score DESC`
