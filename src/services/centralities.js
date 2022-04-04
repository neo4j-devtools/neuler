import { runStreamQuery, runStoreQuery } from "./stores/neoStore"
import { parseProperties } from "./resultMapper"

const handleException = error => {
	console.error(error)
	throw new Error(error)
}

export const runAlgorithm = ({
	streamCypher,
	storeCypher,
	fetchCypher,
	parameters,
	persisted
}) => {
	if (!persisted) {
		return runStreamQuery(streamCypher, parameters, parseResultStream)
	} else {
		return runStoreQuery(
			storeCypher,
			fetchCypher,
			parameters,
			parseResultStream
		)
	}
}

const parseResultStream = result => {
	if (result.records) {
		const rows = result.records.map(record => {
			const { properties, labels, identity } = record.get("node")
			return {
				properties: parseProperties(properties),
				identity: identity.toNumber(),
				labels,
				score: record.get("score")
			}
		})

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

export const runHITSAlgorithm = ({
	streamCypher,
	storeCypher,
	fetchCypher,
	parameters,
	persisted
}) => {
	if (!persisted) {
		return runStreamQuery(streamCypher, parameters, parseHITSResultStream)
	} else {
		return runStoreQuery(
			storeCypher,
			fetchCypher,
			parameters,
			parseHITSResultStream
		)
	}
}

const parseHITSResultStream = result => {
	if (result.records) {
		const rows = result.records.map(record => {
			const { properties, labels, identity } = record.get("node")
			return {
				properties: parseProperties(properties),
				identity: identity.toNumber(),
				labels,
				hubScore: record.get("hubScore"),
				authScore: record.get("authScore")
			}
		})

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
