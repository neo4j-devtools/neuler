import { runCypher, runStreamQuery, runStoreQuery } from "./stores/neoStore"
import { parseProperties } from "./resultMapper"

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
		return runStoreQuery(
			storeCypher,
			fetchCypher,
			parameters,
			parseResultStreamFn
		)
	}
}

export const runkNNAlgorithm = ({
	streamCypher,
	storeCypher,
	fetchCypher,
	parameters,
	persisted
}) => {
	return runAlgorithm({
		streamCypher,
		storeCypher,
		fetchCypher,
		parameters,
		persisted,
		parseResultStreamFn: result => {
			if (result.records) {
				let rows = result.records.map(record => {
					const from = record.get("from")
					const to = record.get("to")

					return {
						fromProperties: parseProperties(from.properties),
						fromLabels: from.labels,
						fromIdentity: from.identity.toNumber(),
						to: to.map(m => {
							return {
								properties: parseProperties(m.node.properties),
								labels: m.node.labels,
								identity: m.node.identity.toNumber(),
								similarity: parseFloat(m.similarity.toFixed(2))
							}
						})
					}
				})
				return {
					rows: rows,
					ids: [
						...new Set(
							rows.flatMap(result =>
								[result.fromIdentity].concat(
									result.to.map(node => node.identity)
								)
							)
						)
					],
					labels: [
						...new Set(
							rows.flatMap(result =>
								result.fromLabels.concat(result.to.flatMap(node => node.labels))
							)
						)
					]
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

const runStreamingAlgorithmOld = (
	streamCypher,
	parameters,
	parseResultStreamFn = parseResultStream
) => {
	return runCypher(streamCypher, parameters)
		.then(result => parseResultStreamFn(result))
		.catch(handleException)
}

export const runAlgorithmOld = ({
	streamCypher,
	storeCypher,
	fetchCypher,
	parameters,
	persisted,
	parseResultStreamFn = parseResultStream
}) => {
	if (!persisted) {
		return runStreamingAlgorithmOld(
			streamCypher(),
			parameters,
			parseResultStreamFn
		)
	} else {
		return new Promise((resolve, reject) => {
			runCypher(storeCypher(), parameters)
				.then(() => {
					runCypher(fetchCypher, parameters)
						.then(result => resolve(parseResultStreamFn(result)))
						.catch(reject)
				})
				.catch(reject)
		})
	}
}

export const parseResultStream = result => {
	if (result.records) {
		let rows = result.records.map(record => {
			const from = record.get("from")
			const to = record.get("to")
			return {
				fromProperties: parseProperties(from.properties),
				fromLabels: from.labels,
				fromIdentity: from.identity.toNumber(),

				toProperties: to.properties,
				toLabels: to.labels,
				toIdentity: to.identity.toNumber(),

				similarity: record.get("similarity")
			}
		})
		return {
			rows: rows,
			ids: [
				...new Set(
					rows.flatMap(result => [result.fromIdentity, result.toIdentity])
				)
			],
			labels: [
				...new Set(
					rows.flatMap(result => result.fromLabels.concat(result.toLabels))
				)
			]
		}
	} else {
		console.error(result.error)
		throw new Error(result.error)
	}
}

export const constructSimilarityMaps = (item, relationshipType, category) => {
	const itemNode = notAll(item) ? `(item:\`${item}\`)` : `(item)`
	const rel = relationshipType ? `[:\`${relationshipType}\`]` : ""
	const categoryNode = notAll(category)
		? `(category:\`${category}\`)`
		: "(category)"

	return `MATCH ${itemNode}-${rel}->${categoryNode}
WITH {item:id(item), categories: collect(distinct id(category))} as userData
WITH collect(userData) as data`
}

const notAll = value => value && value !== "*"

export const constructWeightedSimilarityMaps = (
	item,
	relationshipType,
	category,
	weightProperty
) => {
	const itemNode = notAll(item) ? `(item:\`${item}\`)` : `(item)`
	const rel = relationshipType ? `[rel:\`${relationshipType}\`]` : "[rel]"
	const categoryNode = notAll(category)
		? `(category:\`${category}\`)`
		: "(category)"

	return `MATCH ${itemNode}, ${categoryNode}
OPTIONAL MATCH ${itemNode}-${rel}->${categoryNode}
WITH {item:id(item), weights: collect(coalesce(rel.\`${weightProperty}\`, gds.util.NaN()))} as userData
WITH collect(userData) as data`
}
