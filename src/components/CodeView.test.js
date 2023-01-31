import {constructQueries} from './CodeView';
import {getAlgorithmDefinitions} from "./algorithmsLibrary";

describe("Code View should", () => {
    it('creates named graph query for centrality algorithm', () => {
        const realDateNow = Date.now.bind(global.Date);
        const dateNowStub = jest.fn(() => 123);
        global.Date.now = dateNowStub;

        const algorithmDefinition = getAlgorithmDefinitions("Centralities", "Degree", "2.3.0");
        const parameters = {
            config: {
            },
            gdsVersion: "2.3.0",
            graphConfig: {

            }
        }
        let queries = constructQueries(algorithmDefinition, parameters, algorithmDefinition.streamQuery);

        console.log(queries)

        expect(queries.storeAlgorithmNamedGraph).toEqual('CALL gds.degree.write($generatedName, $config)')
        expect(queries.streamAlgorithmNamedGraph).toEqual(`CALL gds.degree.stream($generatedName, $config) YIELD nodeId, score
WITH gds.util.asNode(nodeId) AS node, score
RETURN node, score
ORDER BY score DESC
LIMIT toInteger($limit)`)
        expect(queries.createGraph).toEqual('CALL gds.graph.project($generatedName, $graphConfig.nodeProjection, $graphConfig.relationshipProjection, {})')
        expect(queries.dropGraph).toEqual('CALL gds.graph.drop($generatedName)')
        global.Date.now = realDateNow;
    })

    it('creates named graph query for community detection algorithm', () => {
        const algorithmDefinition = getAlgorithmDefinitions("Community Detection", "Louvain", "2.3.0");
        const parameters = {
            config: {

            },
            gdsVersion: "2.3.0",
        }
        let queries = constructQueries(algorithmDefinition, parameters, algorithmDefinition.streamQuery);

        expect(queries.storeAlgorithmNamedGraph).toEqual('CALL gds.louvain.write($generatedName, $config)')
        expect(queries.streamAlgorithmNamedGraph).toEqual(`CALL gds.louvain.stream($generatedName, $config)
YIELD nodeId, communityId AS community, intermediateCommunityIds AS communities
WITH gds.util.asNode(nodeId) AS node, community, communities
WITH community, communities, collect(node) AS nodes
RETURN community, communities, nodes[0..$communityNodeLimit] AS nodes, size(nodes) AS size
ORDER BY size DESC
LIMIT toInteger($limit)`)
        expect(queries.createGraph).toEqual('CALL gds.graph.project($generatedName, $graphConfig.nodeProjection, $graphConfig.relationshipProjection, {})')
        expect(queries.dropGraph).toEqual('CALL gds.graph.drop($generatedName)')
    })

    it('creates named graph query for node similarity algorithm', () => {
        const algorithmDefinition = getAlgorithmDefinitions("Similarity", "Jaccard", "2.3.0");
        const parameters = {
            config: {
                similarityCutoff: 0.7,
                degreeCutoff: 1,
            },
            gdsVersion: "2.3.0",
        }
        let queries = constructQueries(algorithmDefinition, parameters, algorithmDefinition.streamQuery);

        expect(queries.storeAlgorithmNamedGraph).toEqual('CALL gds.nodeSimilarity.write($generatedName, $config)')
        expect(queries.streamAlgorithmNamedGraph).toEqual(`CALL gds.nodeSimilarity.stream($generatedName, $config) YIELD node1, node2, similarity
RETURN gds.util.asNode(node1) AS from, gds.util.asNode(node2) AS to, similarity
ORDER BY similarity DESC
LIMIT toInteger($limit)`)
        expect(queries.createGraph).toEqual('CALL gds.graph.project($generatedName, $graphConfig.nodeProjection, $graphConfig.relationshipProjection, {})')
        expect(queries.dropGraph).toEqual('CALL gds.graph.drop($generatedName)')
    })

    it('creates named graph query for shortest path algorithm', () => {
        const algorithmDefinition = getAlgorithmDefinitions("Path Finding", "Shortest Path", "1.3.1");
        const parameters = {
            config: {
            },
            gdsVersion: "2.3.0",
        }
        let queries = constructQueries(algorithmDefinition, parameters, algorithmDefinition.streamQuery);

        expect(queries.streamAlgorithmNamedGraph).toEqual(`CALL db.propertyKeys() YIELD propertyKey MATCH (start) WHERE start[propertyKey] contains $startNode
WITH start
LIMIT 1
CALL db.propertyKeys() YIELD propertyKey MATCH (end) WHERE end[propertyKey] contains $endNode
WITH start, end
LIMIT 1
WITH $config AS config, start, end
WITH config { .*, sourceNode: id(start), targetNode: id(end)} as config
CALL gds.shortestPath.dijkstra.stream($generatedName, config)
YIELD nodeIds, costs
UNWIND range(0, size(nodeIds)-1) AS index
RETURN gds.util.asNode(nodeIds[index]) AS node, costs[index] AS cost`)
        expect(queries.createGraph).toEqual('CALL gds.graph.project($generatedName, $graphConfig.nodeProjection, $graphConfig.relationshipProjection, {})')
        expect(queries.dropGraph).toEqual('CALL gds.graph.drop($generatedName)')
    })

    it('creates named graph query for A* algorithm', () => {
        const algorithmDefinition = getAlgorithmDefinitions("Path Finding", "A*", "2.3.0");
        const parameters = {
            config: {
            },
            gdsVersion:"2.3.0",
        }
        let queries = constructQueries(algorithmDefinition, parameters, algorithmDefinition.streamQuery);

        expect(queries.streamAlgorithmNamedGraph).toEqual(`CALL db.propertyKeys() YIELD propertyKey MATCH (start) WHERE start[propertyKey] contains $startNode
WITH start
LIMIT 1
CALL db.propertyKeys() YIELD propertyKey MATCH (end) WHERE end[propertyKey] contains $endNode
WITH start, end
LIMIT 1
WITH $config AS config, start, end
WITH config { .*, sourceNode: id(start), targetNode: id(end)} as config
CALL gds.shortestPath.astar.stream($generatedName, config)
YIELD targetNode, totalCost AS cost
RETURN gds.util.asNode(targetNode) AS node, cost`)
        expect(queries.createGraph).toEqual('CALL gds.graph.project($generatedName, $graphConfig.nodeProjection, $graphConfig.relationshipProjection, {})')
        expect(queries.dropGraph).toEqual('CALL gds.graph.drop($generatedName)')
    })

    it('creates named graph query for SSSP algorithm', () => {
        const algorithmDefinition = getAlgorithmDefinitions("Path Finding", "Single Source Shortest Path", "2.3.0");
        const parameters = {
            config: {
            },
            gdsVersion: "2.3.0",
        }
        let queries = constructQueries(algorithmDefinition, parameters, algorithmDefinition.streamQuery);

        expect(queries.streamAlgorithmNamedGraph).toEqual(`CALL db.propertyKeys() YIELD propertyKey MATCH (start) WHERE start[propertyKey] contains $startNode
WITH start
LIMIT 1
WITH $config AS config, start
WITH config { .*, sourceNode: id(start)} as config
CALL gds.allShortestPaths.dijkstra.stream($generatedName, config)
YIELD targetNode AS nodeId, totalCost AS cost
RETURN gds.util.asNode(nodeId) AS node, cost
LIMIT toInteger($limit)`)
        expect(queries.createGraph).toEqual('CALL gds.graph.project($generatedName, $graphConfig.nodeProjection, $graphConfig.relationshipProjection, {})')
        expect(queries.dropGraph).toEqual('CALL gds.graph.drop($generatedName)')
    })

})