import {runCypher} from "./stores/neoStore"

const findApocProceduresCypher = `
CALL dbms.procedures()
YIELD name
WHERE name STARTS WITH "apoc"
RETURN count(*) AS count
`

export const checkApocInstalled = () => {
  return runCypher(findApocProceduresCypher)
      .then(result => (parseResultStream(result)))
      .catch(handleException)
}

export const checkApocMetaProcedureAvailable = () => {
  return runCypher("CALL apoc.meta.nodeTypeProperties() YIELD propertyName RETURN count(*) AS count")
      .then(result => true)
      .catch(error => false)
}

const findGraphAlgosProceduresCypher = `
CALL dbms.procedures()
YIELD name
WHERE name STARTS WITH "gds"
RETURN count(*) AS count
`

export const checkGraphAlgorithmsInstalled = () => {
  return runCypher(findGraphAlgosProceduresCypher)
    .then(result => (parseResultStream(result)))
    .catch(handleException)
}

const handleException = error => {
  console.error(error)
  throw new Error(error)
}





export const parseResultStream = result => {
  if (result.records) {
    return result.records[0].get("count").toNumber() > 0
  } else {
    return false;
  }
}
