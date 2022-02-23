import {runCypher, runStreamQuery, runStoreQuery} from "./stores/neoStore"
import {parseProperties} from "./resultMapper"


export const runAlgorithm = ({streamCypher, storeCypher, fetchCypher, parameters, persisted, parseResultStreamFn = parseResultStream}) => {
  if (!persisted) {
    return runStreamQuery(streamCypher, parameters, parseResultStreamFn)
  } else {
    return runStoreQuery(storeCypher, fetchCypher, parameters, parseResultStreamFn)
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
          nodeAIdentity: nodeA.identity.toNumber(),

          nodeBProperties: parseProperties(nodeB.properties),
          nodeBLabels: nodeB.labels,
          nodeBIdentity: nodeB.identity.toNumber(),

          nodeCProperties: parseProperties(nodeC.properties),
          nodeCLabels: nodeC.labels,
          nodeCIdentity: nodeC.identity.toNumber()
        }
      });
      return {
        rows: rows,
        ids: [...new Set(rows.flatMap(result => [result.nodeAIdentity, result.nodeBIdentity, result.nodeCIdentity]))],
        labels: [...new Set(rows.flatMap(result => result.nodeALabels.concat(result.nodeBLabels).concat(result.nodeCLabels)))]
      }
    } else {
      console.error(result.error)
      throw new Error(result.error)
    }
  })
}

export const triangleCountNew = ({streamCypher, storeCypher, fetchCypher, parameters, persisted}) => {
  return runAlgorithm({
    streamCypher, storeCypher, fetchCypher, parameters, persisted, parseResultStreamFn: result => {
      if (result.records) {
        let rows = result.records.map(record => {
          const {properties, labels, identity} = record.get('node')

          return {
            properties: parseProperties(properties),
            identity: identity.toNumber(),
            labels: labels,
            triangles: record.get('triangles').toNumber()
          }
        });
        return {
          rows: rows,
          ids: rows.map(row => row.identity),
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
          const {properties, labels, identity} = record.get('node')

          return {
            properties: parseProperties(properties),
            identity: identity.toNumber(),
            labels: labels,
            coefficient: record.get('coefficient')
          }
        });
        return {
          rows: rows,
          ids: rows.map(row => row.identity),
          labels: [...new Set(rows.flatMap(result => result.labels))]
        }
      } else {
        console.error(result.error)
        throw new Error(result.error)
      }
    }
  })
}

export const runSpeakerListenerLPA = ({streamCypher, storeCypher, fetchCypher, parameters, persisted}) => {
  return runAlgorithm({
    streamCypher, storeCypher, fetchCypher, parameters, persisted, parseResultStreamFn: result => {
      if (result.records) {
        const rows = result.records.map(record => {
          const nodes = record.get('nodes')
          const communities = record.get("communities")
          return {
            nodes: nodes.map(node => { return { properties: parseProperties(node.properties), identity: node.identity.toNumber(), labels: node.labels } }) ,
            size: record.get('size').toNumber(),
            communities: communities ? communities.map(value => value.toNumber()).toString() : null
          }
        });
        return {
          rows: rows,
          ids: [...new Set(rows.flatMap(result => result.nodes.map(node => node.identity)))],
          labels: [...new Set(rows.flatMap(result => result.nodes.flatMap(node => node.labels)))]
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
        nodes: nodes.map(node => { return { properties: parseProperties(node.properties), identity: node.identity.toNumber(), labels: node.labels } }) ,
        size: record.get('size').toNumber(),
        community: record.get('community').toNumber(),
        communities: communities ? communities.map(value => value.toNumber()).toString() : null
      }
    });
    return {
      rows: rows,
      ids: [...new Set(rows.flatMap(result => result.nodes.map(node => node.identity)))],
      labels: [...new Set(rows.flatMap(result => result.nodes.flatMap(node => node.labels)))]
    }
  } else {
    console.error(result.error)
    throw new Error(result.error)
  }
}
