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

export const loadGdsVersion = () => {
  return runCypher(`RETURN gds.version() AS version`, {})
    .then(parseGdsVersionResultStream)
    .catch(handleException)
}

export const loadMetadata = () => loadLabels().then(labels => {
  return loadRelationshipTypes().then(relationships => {
    return loadGdsVersion().then(gdsVersion => ({
      labels, relationships, gdsVersion
    }))
  })
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

const parseGdsVersionResultStream = result => {
  if (result.records) {
    return result.records[0].get("version")
  } else {
    console.error(result.error)
    throw new Error(result.error)
  }
}

const handleException = error => {
  console.error(error)
  throw new Error(error)
}
