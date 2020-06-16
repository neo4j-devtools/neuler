import { driver, auth } from 'neo4j-driver'

let neoDriver
let neo4jVersion
let activeDatabase = "neo4j"

export const getDriver = () => {
  /*if (!driver) {
    driver = neo.driver('bolt://localhost:7687', neo.auth.basic("neo4j", "neo"))
  }*/
  return neoDriver
}

export const getNeo4jVersion = () => {
  return neo4jVersion
}

export const getActiveDatabase = () => {
  return activeDatabase
}

export const hasNamedDatabase = () => {
  const version = getNeo4jVersion().split(".").slice(0, 1).join(".")
  return version === "4"
}

export const onNewConnection = credentials => {
  neoDriver = driver(credentials.host || 'bolt://localhost:7687',
    auth.basic(credentials.username, credentials.password), { encrypted: credentials.encrypted })
}

export const onNeo4jVersion = version => {
  console.log("neo4jVersion", version)
  neo4jVersion = version
}

export const onActiveDatabase = value => {
  activeDatabase = value
}

export const onDisconnected = () => {
  /* console.log('DISCONNECTING!!')
   neoDriver.close()
   neoDriver = null*/
}

const getSession = (database) => {
  return getDriver().session({database: database})
}

export const runCypher = (cypher, parameters = {}) => {
  const version = getNeo4jVersion().split(".").slice(0, 1).join(".")
  if (version === "4") {
    return getSession(activeDatabase).run(cypher, parameters)
  } else {
    return getDriver().session().run(cypher, parameters)
  }

}

export const runCypherDefaultDatabase = (cypher, parameters = {}) => {
  const session = getDriver().session()
  return session.run(cypher, parameters)
}

export const runCypherSystemDatabase = (cypher, parameters = {}) => {
  const session = getSession("system")
  return session.run(cypher, parameters)
}
