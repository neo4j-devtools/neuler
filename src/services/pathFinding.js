import {runCypher} from "./stores/neoStore"
import {parseProperties} from "./resultMapper"

export const runAlgorithm = ({streamCypher, storeCypher, fetchCypher, parameters, persisted, parseResultStreamFn=parseResultStream}) => {
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
                .catch(handleException)
        })
    }
}

const runStreamingAlgorithm = (streamCypher, parameters, parseResultStreamFn=parseResultStream) => {
    return runCypher(streamCypher, parameters)
        .then(result => parseResultStreamFn(result))
        .catch(handleException)
}



export const parseResultStream = (result) => {
    if (result.records) {
        return result.records.map(record => {
            const { properties, labels } = record.get('node')
            return {
                properties: parseProperties(properties),
                labels: labels,
                cost: record.get('cost')
            }
        })
    } else {
        console.error(result.error)
        throw new Error(result.error)
    }
}

const handleException = error => {
    console.error(error)
    throw new Error(error)
}