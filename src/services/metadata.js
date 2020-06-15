import {runCypher, runCypherDefaultDatabase, runCypherNamedDatabase} from "./stores/neoStore"

export const loadLabels = (activateDatabase) => {
  return runCypherNamedDatabase("CALL db.labels()", activateDatabase, {})
    .then(parseLabelsResultStream)
    .catch(handleException)
}

export const loadRelationshipTypes = (activateDatabase) => {
  return runCypherNamedDatabase(`CALL db.relationshipTypes() 
YIELD relationshipType
RETURN relationshipType
ORDER BY relationshipType`, activateDatabase, {})
    .then(parseRelTypesResultStream)
    .catch(handleException)
}

export const loadPropertyKeys = (activateDatabase) => {
  return runCypherNamedDatabase(`call db.propertyKeys()
YIELD propertyKey
RETURN propertyKey
ORDER BY propertyKey`, activateDatabase, {})
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

export const loadDatabases = () => {
  return runCypherNamedDatabase(`SHOW DATABASES`, "system")
    .then(parseDatabasesResultStream)
    .catch(handleException)
}

export const loadMetadata = (activeDatabase) => loadVersions().then(versions => {
  const neo4jVersion = versions.neo4jVersion.split(".").slice(0, 1).join(".")
  if (neo4jVersion === "4") {
    return loadDatabases().then(databases => {
      return loadLabels(activeDatabase).then(labels => {
        return loadRelationshipTypes(activeDatabase).then(relationships => {
          return loadPropertyKeys(activeDatabase).then(propertyKeys => ({
            labels, relationships, propertyKeys, versions, databases
          }))
        })
      })
    })
  } else {
    return Promise.resolve([{name: "neo4j", default: true}]).then(databases => {
      return loadLabels(null).then(labels => {
        return loadRelationshipTypes(null).then(relationships => {
          return loadPropertyKeys(null).then(propertyKeys => ({
            labels, relationships, propertyKeys, versions, databases
          }))
        })
      })
    })
  }
});

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
