import { driver, auth } from 'neo4j-driver'

let neoDriver

export const getDriver = () => {
  /*if (!driver) {
    driver = neo.driver('bolt://localhost:7687', neo.auth.basic("neo4j", "neo"))
  }*/
  return neoDriver
}

export const onNewConnection = credentials => {
  neoDriver = driver(credentials.host || 'bolt://localhost:7687',
    auth.basic(credentials.username, credentials.password), { encrypted: credentials.encrypted })
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
  const session = getSession("neo4j")
  return session.run(cypher, parameters)
}

export const runCypherNamedDatabase = (cypher, database, parameters = {}) => {
  const session = getSession(database)
  return session.run(cypher, parameters)
}