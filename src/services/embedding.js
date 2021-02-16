import {runCypher} from "./stores/neoStore"
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
