import { runCypher } from "./stores/neoStore"
import { v1 } from 'neo4j-driver'

export const loadLabels = () => {

  return runCypher("CALL db.labels()", {})
    .then(parseLabelsResultStream)
    .catch(handleException)
}

export const loadRelationshipTypes = () => {

  return runCypher("CALL db.relationshipTypes()", {})
    .then(parseRelTypesResultStream)
    .catch(handleException)
}

const parseLabelsResultStream = result => {
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

const parseRelTypesResultStream = result => {
  if (result.records) {
    return result.records.map(record => {
      return {
        label: record.get("relationshipType")
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
