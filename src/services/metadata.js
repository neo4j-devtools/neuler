import { runCypher } from "./stores/neoStore"
import { v1 } from 'neo4j-driver'

export const loadLabels = () => {

  return runCypher("CALL db.labels()", {})
    .then(result => ({rows: parseResultStream(result)}))
    .catch(handleException)
}

const parseResultStream = result => {
  if (result.records) {
    return result.records.map(record => {
      return {
        label: record.get("label")
      }
    })
  } else {
    console.error(result.error)
    throw new Error(result.error)
  }
}
const handleException = error => {
  console.error(error)
  throw new Error(error)
}
