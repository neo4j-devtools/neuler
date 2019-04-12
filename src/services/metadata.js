import { runCypher } from "./stores/neoStore"

export const loadLabels = () => {
  return runCypher("CALL db.labels()", {})
    .then(parseLabelsResultStream)
    .catch(handleException)
}

export const loadRelationshipTypes = () => {
  return runCypher(`CALL db.relationshipTypes() 
YIELD relationshipType
RETURN relationshipType
ORDER BY relationshipType`, {})
    .then(parseRelTypesResultStream)
    .catch(handleException)
}

export const loadMetadata = () => loadLabels().then(labels => {
  return loadRelationshipTypes().then(relationships => ({
    labels,
    relationships
  }))
})

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
