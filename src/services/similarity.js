import {runCypher} from "./stores/neoStore"
import {parseProperties} from "./resultMapper"

export const runAlgorithm = ({streamCypher, storeCypher, fetchCypher, parameters, persisted, parseResultStreamFn = parseResultStream}) => {
  if (!persisted) {
    return runStreamingAlgorithm(streamCypher, parameters, parseResultStreamFn)
  } else {
    return new Promise((resolve, reject) => {
      runCypher(storeCypher, parameters)
        .then(() => {
          runCypher(fetchCypher, parameters)
            .then(result => resolve(parseResultStreamFn(result)))
            .catch(reject)
        })
        .catch(reject)
    })
  }
}


const handleException = error => {
  console.error(error)
  throw new Error(error)
}

const runStreamingAlgorithm = (streamCypher, parameters, parseResultStreamFn = parseResultStream) => {
  return runCypher(streamCypher, parameters)
    .then(result => parseResultStreamFn(result))
    .catch(handleException)
}


export const parseResultStream = (result) => {
  if (result.records) {
    let rows = result.records.map(record => {
      const from = record.get('from')
      const to = record.get('to')
      return {
        fromProperties: parseProperties(from.properties),
        fromLabels: from.labels,
        toProperties: to.properties,
        toLabels: to.labels,
        similarity: record.get("similarity")

      }
    });
    return {
      rows: rows,
      labels: [...new Set(rows.flatMap(result => result.fromLabels.concat(result.toLabels)))]
    }
  } else {
    console.error(result.error)
    throw new Error(result.error)
  }
}

export const constructSimilarityMaps = (item, relationshipType, category) => {
  const itemNode = notAll(item) ?  `(item:\`${item}\`)` : `(item)`
  const rel =  relationshipType ? `[:\`${relationshipType}\`]` : ""
  const categoryNode = notAll(category) ? `(category:\`${category}\`)` : "(category)"

  return `MATCH ${itemNode}-${rel}->${categoryNode}
WITH {item:id(item), categories: collect(distinct id(category))} as userData
WITH collect(userData) as data`
}

const notAll = value => value && value !== "*"

export const constructWeightedSimilarityMaps = (item, relationshipType, category, weightProperty) => {
  const itemNode = notAll(item) ?  `(item:\`${item}\`)` : `(item)`
  const rel =  relationshipType ? `[rel:\`${relationshipType}\`]` : "[rel]"
  const categoryNode = notAll(category) ? `(category:\`${category}\`)` : "(category)"

  return `MATCH ${itemNode}, ${categoryNode}
OPTIONAL MATCH ${itemNode}-${rel}->${categoryNode}
WITH {item:id(item), weights: collect(coalesce(rel.\`${weightProperty}\`, gds.util.NaN()))} as userData
WITH collect(userData) as data`
}
