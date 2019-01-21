import { v1 as neo } from 'neo4j-driver'

let driver

const getDriver = () => {
  if (!driver) {
    driver = neo.driver('bolt://localhost:7687', neo.auth.basic("neo4j", "a"))
  }

  return driver
}

const getSession = () => {
  return getDriver().session()
}

export const runCypher = (cypher, parameters) => {
  const session = getSession()
  return session.run(cypher, parameters)
}