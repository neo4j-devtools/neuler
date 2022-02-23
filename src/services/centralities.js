import { runCypher } from "./stores/neoStore"
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
	const gdsMainVersion = parseInt(parameters.gdsVersion.split(".")[0])
	const generatedName = `in-memory-graph-${Date.now()}`
	parameters.generatedName = generatedName
	const createGraph = `CALL gds.graph.${
		gdsMainVersion === 1 ? "create" : "project"
	}("${generatedName}", $graphConfig.nodeProjection, $graphConfig.relationshipProjection)`
	const dropGraph = `CALL gds.graph.drop("${generatedName}")`

  console.log(streamCypher)

	if (!persisted) {
		return new Promise((resolve, reject) => {
			runCypher(createGraph, parameters)
				.then(() =>
					runCypher(streamCypher, parameters)
						.then(result => {
							runCypher(dropGraph)
							resolve(parseResultStream(result))
						})
						.catch(reject)
				)
				.catch(reject)
		})
	} else {
		return new Promise((resolve, reject) => {
			runCypher(createGraph, parameters).then(() =>
				runCypher(storeCypher, parameters)
					.then(() => {
						runCypher(fetchCypher, parameters)
							.then(result => {
								runCypher(dropGraph)
								resolve(parseResultStream(result))
							})
							.catch(reject)
					})
					.catch(reject)
			)
		})
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
		return runCypher(streamCypher, parameters)
			.then(result => parseHITSResultStream(result))
			.catch(handleException)
	} else {
		return new Promise((resolve, reject) => {
			runCypher(storeCypher, parameters)
				.then(() => {
					runCypher(fetchCypher, parameters)
						.then(result => resolve(parseHITSResultStream(result)))
						.catch(reject)
				})
				.catch(reject)
		})
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
