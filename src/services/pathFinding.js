import {runStreamQuery} from "./stores/neoStore"
import {parseProperties} from "./resultMapper"

export const runStreamingAlgorithm = ({streamCypher, parameters, parseResultStreamFn=parseResultStream}) => {
    return runStreamQuery(streamCypher, parameters, parseResultStreamFn)
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
                    sourceIdentity: source.identity.toNumber(),

                    targetProperties: parseProperties(target.properties),
                    targetLabels: target.labels,
                    targetIdentity: target.identity.toNumber(),

                    cost: record.get('cost')
                }
            });
            return {
                rows: rows,
                ids: [...new Set(rows.flatMap(result => [result.sourceIdentity, result.targetIdentity]))],
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
            const { properties, labels, identity } = record.get('node')
            return {
                properties: parseProperties(properties),
                identity: identity.toNumber(),
                labels: labels,
                cost: record.get('cost')
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

const handleException = error => {
    console.error(error)
    throw new Error(error)
}
