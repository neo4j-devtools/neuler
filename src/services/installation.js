import {runCypher} from "./stores/neoStore"

export const findApocProceduresCypher = `
SHOW PROCEDURES
YIELD name
WHERE name STARTS WITH "apoc"
RETURN count(*) AS count`

export const checkApocMetaProcedure = "CALL apoc.meta.schema() YIELD value RETURN count(*) AS count";

export const checkApocInstalled = () => {
  return runCypher(findApocProceduresCypher)
      .then(result => (parseResultStream(result)))
      .catch(handleException)
}

export const checkApocMetaProcedureAvailable = () => {
  return runCypher(checkApocMetaProcedure)
      .then(result => true)
      .catch(error => false)
}

export const findGraphAlgosProceduresCypher = `SHOW PROCEDURES
YIELD name
WHERE name STARTS WITH "gds"
RETURN count(*) AS count`

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
