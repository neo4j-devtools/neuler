import { v1 as neo } from 'neo4j-driver'

let neoDriver

export const getDriver = () => {
  /*if (!driver) {
    driver = neo.driver('bolt://localhost:7687', neo.auth.basic("neo4j", "neo"))
  }*/
  return neoDriver
}

export const onNewConnection = credentials => {
  /*
       encrypted:false
       host:"bolt://localhost:7687"
       password
       username
        */

  neoDriver = neo.driver(credentials.host || 'bolt://localhost:7687',
    neo.auth.basic(credentials.username, credentials.password))
}

export const onDisconnected = () => {
  /* console.log('DISCONNECTING!!')
   neoDriver.close()
   neoDriver = null*/
}

const getSession = () => {
  return getDriver().session()
}

export const runCypher = (cypher, parameters = {}) => {
  const session = getSession()
  return session.run(cypher, parameters)
}
