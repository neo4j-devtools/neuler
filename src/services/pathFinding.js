import {runCypher} from "./stores/neoStore"
import {parseProperties} from "./resultMapper"

export const runStreamingAlgorithm = ({streamCypher, parameters, parseResultStreamFn=parseResultStream}) => {
    return runCypher(streamCypher, parameters)
        .then(result => parseResultStreamFn(result))
        .catch(handleException)
}

export const runAllPairsShortestPathAlgorithm = ({streamCypher, parameters}) => {
    return runStreamingAlgorithm({streamCypher, parameters, parseResultStreamFn: result => {
        if (result.records) {
            let rows = result.records.map(record => {
                const source = record.get('source')
                const target = record.get('target')

                return {
                    sourceProperties: parseProperties(source.properties),
                    sourceLabels: source.labels,
                    targetProperties: parseProperties(target.properties),
                    targetLabels: target.labels,
                    cost: record.get('cost')
                }
            });
            return {
                rows: rows,
                labels: [...new Set(rows.flatMap(result => result.sourceLabels.concat(result.targetLabels)))]
            }
        } else {
            console.error(result.error)
            throw new Error(result.error)
        }
    }})
}



export const parseResultStream = (result) => {
    if (result.records) {
        let rows = result.records.map(record => {
            const { properties, labels } = record.get('node')
            return {
                properties: parseProperties(properties),
                labels: labels,
                cost: record.get('cost')
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

const handleException = error => {
    console.error(error)
    throw new Error(error)
}