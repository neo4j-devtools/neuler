import { auth, driver } from "neo4j-driver"

let neoDriver
let neo4jVersion
let activeDatabase = "neo4j"

export const getDriver = () => {
	/*if (!driver) {
    driver = neo.driver('bolt://localhost:7687', neo.auth.basic("neo4j", "neo"))
  }*/
	return neoDriver
}

export const getNeo4jVersion = () => {
	return neo4jVersion
}

export const getActiveDatabase = () => {
	return activeDatabase
}

export const hasNamedDatabase = () => {
	const version = mainNeo4jVersion()
	return version >= 4
}

export const onNewConnection = credentials => {
	neoDriver = driver(
		credentials.host || "bolt://localhost:7687",
		auth.basic(credentials.username, credentials.password)
	)

	return neoDriver.verifyConnectivity().then(value => {
		onNeo4jVersion(value.version.split("/")[1])
		return Promise.resolve(getNeo4jVersion())
	})
}

export const onNeo4jVersion = version => {
	neo4jVersion = version
}

export const onActiveDatabase = value => {
	activeDatabase = value
}

export const onDisconnected = () => {
	/* console.log('DISCONNECTING!!')
   neoDriver.close()
   neoDriver = null*/
}

const getSession = database => {
	return getDriver().session({ database: database })
}

export const extractMainVersion = fullVersion => {
	return parseInt(
		fullVersion
			.split(".")
			.slice(0, 1)
			.join(".")
	)
}

export const mainNeo4jVersion = () => {
	return extractMainVersion(getNeo4jVersion())
}

export const runCypher = (cypher, parameters = {}) => {
	const version = mainNeo4jVersion()
	if (version === 4) {
		return getSession(activeDatabase).run(cypher, parameters)
	} else {
		return getDriver()
			.session()
			.run(cypher, parameters)
	}
}

export const runCypherDefaultDatabase = (cypher, parameters = {}) => {
	const session = getDriver().session()
	return session.run(cypher, parameters)
}

export const runCypherSystemDatabase = (cypher, parameters = {}) => {
	const session = getSession("system")
	return session.run(cypher, parameters)
}

export const runStreamQuery = (streamCypher, parameters, parseResultStreamFn) => {
	const gdsMainVersion = parseInt(parameters.gdsVersion.split(".")[0])
	const generatedName = `in-memory-graph-${Date.now()}`
	parameters.generatedName = generatedName
	const createGraph = `CALL gds.graph.${
		gdsMainVersion === 1 ? "create" : "project"
	}("${generatedName}", $graphConfig.nodeProjection, $graphConfig.relationshipProjection)`
	const dropGraph = `CALL gds.graph.drop("${generatedName}")`

	return new Promise((resolve, reject) => {
		runCypher(createGraph, parameters)
			.then(() =>
				runCypher(streamCypher, parameters)
					.then(result => {
						runCypher(dropGraph)
						resolve(parseResultStreamFn(result))
					})
					.catch(reject)
			)
			.catch(reject)
	})
}

export const runStoreQuery = (
	storeCypher,
	fetchCypher,
	parameters,
	parseResultStreamFn
) => {
	const gdsMainVersion = parseInt(parameters.gdsVersion.split(".")[0])
	const generatedName = `in-memory-graph-${Date.now()}`
	parameters.generatedName = generatedName
	const createGraph = `CALL gds.graph.${
		gdsMainVersion === 1 ? "create" : "project"
	}("${generatedName}", $graphConfig.nodeProjection, $graphConfig.relationshipProjection)`
	const dropGraph = `CALL gds.graph.drop("${generatedName}")`

	return new Promise((resolve, reject) => {
		runCypher(createGraph, parameters).then(() =>
			runCypher(storeCypher, parameters)
				.then(() => {
					runCypher(fetchCypher, parameters)
						.then(result => {
							runCypher(dropGraph)
							resolve(parseResultStreamFn(result))
						})
						.catch(reject)
				})
				.catch(reject)
		)
	})
}
