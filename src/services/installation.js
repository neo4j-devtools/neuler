import {runCypher, runCypherDefaultDatabase} from "./stores/neoStore"


export const checkGraphAlgorithmsInstalled = () => {
  return runCypherDefaultDatabase(findGraphAlgosProceduresCypher)
    .then(result => (parseResultStream(result)))
    .catch(handleException)
}

const handleException = error => {
  console.error(error)
  throw new Error(error)
}

const findGraphAlgosProceduresCypher = `
CALL dbms.procedures()
YIELD name
WHERE name STARTS WITH "gds"
RETURN count(*) AS count
`

export const parseResultStream = result => {
  if (result.records) {
    return result.records[0].get("count").toNumber() > 0
  } else {
    return false;
  }
}
