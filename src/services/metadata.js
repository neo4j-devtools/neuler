import {runCypher, runCypherDefaultDatabase, runCypherSystemDatabase} from "./stores/neoStore"

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

export const loadPropertyKeys = () => {
  return runCypher(`call db.propertyKeys()
YIELD propertyKey
RETURN propertyKey
ORDER BY propertyKey`, {})
    .then(parsePropertyKeysResultStream)
    .catch(handleException)
}


export const loadVersions = () => {
  return runCypherDefaultDatabase(`CALL dbms.components() 
YIELD versions
UNWIND versions as version 
RETURN version AS neo4jVersion, gds.version() AS gdsVersion
LIMIT 1`, {})
    .then(parseGdsVersionResultStream)
    .catch(handleException)
}

export const loadDatabases = (neo4jVersion) => {
  const version = neo4jVersion.split(".").slice(0, 1).join(".")

  if(version === "4") {
    return runCypherSystemDatabase(`SHOW DATABASES`)
      .then(parseDatabasesResultStream)
      .catch(handleException)
  } else {
    return Promise.resolve([{name: "neo4j", default: true}]);
  }
}

export const loadMetadata = (neo4jVersion) => {
  return loadDatabases(neo4jVersion).then(databases => {
    return loadLabels().then(labels => {
      return loadRelationshipTypes().then(relationships => {
        return loadPropertyKeys().then(propertyKeys => ({
          labels, relationships, propertyKeys, databases
        }))
      })
    })
  })
};

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

const parsePropertyKeysResultStream = result => {
  if (result.records) {
    return result.records.map(record => {
      return {
        propertyKey: record.get("propertyKey")
      }
    })
  } else {
    console.error(result.error)
    throw new Error(result.error)
  }
}

const parseGdsVersionResultStream = result => {
  if (result.records) {
    let row = result.records[0];
    return {gdsVersion: row.get("gdsVersion"), neo4jVersion: row.get("neo4jVersion")}
  } else {
    console.error(result.error)
    throw new Error(result.error)
  }
}

const parseDatabasesResultStream = result => {
  if (result.records) {
    return result.records.filter(record => record.get("name") !== "system").map(record => {
      return {
        name: record.get("name"),
        default: record.get("default"),
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
