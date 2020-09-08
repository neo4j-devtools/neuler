import {runCypher} from "./stores/neoStore"
import {parseProperties} from "./resultMapper"

const baseParameters = (label, relationshipType, direction, limit) => {
  return {
    label: label || null,
    relationshipType: relationshipType || null,
    direction: direction || 'Outgoing',
    limit: parseInt(limit) || 50
  }
}


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

export const triangles = ({streamCypher, parameters}) => {
  return runStreamingAlgorithm(streamCypher, parameters, result => {
    if (result.records) {
      let rows = result.records.map(record => {
        const nodeA = record.get('nodeA')
        const nodeB = record.get('nodeB')
        const nodeC = record.get('nodeC')

        return {
          nodeAProperties: parseProperties(nodeA.properties),
          nodeALabels: nodeA.labels,
          nodeBProperties: parseProperties(nodeB.properties),
          nodeBLabels: nodeB.labels,
          nodeCProperties: parseProperties(nodeC.properties),
          nodeCLabels: nodeC.labels,
        }
      });
      return {
        rows: rows,
        labels: [...new Set(rows.flatMap(result => result.nodeALabels.concat(result.nodeBLabels).concat(result.nodeCLabels)))]
      }
    } else {
      console.error(result.error)
      throw new Error(result.error)
    }
  })
}

export const triangleCountOld = ({streamCypher, storeCypher, fetchCypher, parameters, persisted}) => {
  return runAlgorithm({
    streamCypher, storeCypher, fetchCypher, parameters, persisted, parseResultStreamFn: result => {
      if (result.records) {
        let rows = result.records.map(record => {
          const {properties, labels} = record.get('node')

          return {
            properties: parseProperties(properties),
            labels: labels,
            triangles: record.get('triangles').toNumber()
          }
        });
        return {
          rows: rows,
          labels: [...new Set(rows.flatMap(result => result.labels))]
        }
      } else {
        console.error(result.error)
        throw new Error(result.error)
      }
    }
  })
}

export const triangleCountNew = ({streamCypher, storeCypher, fetchCypher, parameters, persisted}) => {
  return runAlgorithm({
    streamCypher, storeCypher, fetchCypher, parameters, persisted, parseResultStreamFn: result => {
      if (result.records) {
        let rows = result.records.map(record => {
          const {properties, labels} = record.get('node')

          return {
            properties: parseProperties(properties),
            labels: labels,
            triangles: record.get('triangles').toNumber()
          }
        });
        return {
          rows: rows,
          labels: [...new Set(rows.flatMap(result => result.labels))]
        }
      } else {
        console.error(result.error)
        throw new Error(result.error)
      }
    }
  })
}

export const localClusteringCoefficient = ({streamCypher, storeCypher, fetchCypher, parameters, persisted}) => {
  return runAlgorithm({
    streamCypher, storeCypher, fetchCypher, parameters, persisted, parseResultStreamFn: result => {
      if (result.records) {
        const rows = result.records.map(record => {
          const {properties, labels} = record.get('node')

          return {
            properties: parseProperties(properties),
            labels: labels,
            coefficient: record.get('coefficient')
          }
        });
        return {
          rows: rows,
          labels: [...new Set(rows.flatMap(result => result.labels))]
        }
      } else {
        console.error(result.error)
        throw new Error(result.error)
      }
    }
  })
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
    const rows = result.records.map(record => {
      const nodes = record.get('nodes')
      const communities = record.has("communities") ? record.get("communities") : null
      return {
        nodes: nodes.map(node => { return { "properties": parseProperties(node.properties), "labels": node.labels } }) ,
        size: record.get('size').toNumber(),
        community: record.get('community').toNumber(),
        communities: communities ? communities.map(value => value.toNumber()).toString() : null
      }
    });
    return {
      rows: rows,
      labels: [...new Set(rows.flatMap(result => result.nodes.flatMap(node => node.labels)))]
    }
  } else {
    console.error(result.error)
    throw new Error(result.error)
  }
}