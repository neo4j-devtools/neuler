import {runStreamQuery, runStoreQuery} from "./stores/neoStore"
import {parseProperties} from "./resultMapper"


export const runAlgorithm = ({
                                 streamCypher,
                                 storeCypher,
                                 fetchCypher,
                                 parameters,
                                 persisted,
                                 parseResultStreamFn = parseResultStream
                             }) => {
    if (!persisted) {
        return runStreamQuery(streamCypher, parameters, parseResultStreamFn)
    } else {
        return runStoreQuery(storeCypher, fetchCypher, parameters, parseResultStreamFn)
    }
}


const handleException = error => {
    console.error(error)
    throw new Error(error)
}

export const parseResultStream = (result) => {
    if (result.records) {
        const rows = result.records.map(record => {
            const {properties, labels, identity} = record.get('node')
            const embedding = record.has("embedding") ? record.get("embedding") : null
            return {
                properties: parseProperties(properties),
                identity: identity.toNumber(),
                labels,
                embedding: embedding ? embedding.map(value => parseFloat(value)) : null
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
