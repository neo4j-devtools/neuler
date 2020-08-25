import {constructQueries} from './CodeView';
import {getAlgorithmDefinitions} from "./algorithmsLibrary";

describe("Code View should", () => {
    it('creates named graph query for centrality algorithm', () => {
        const realDateNow = Date.now.bind(global.Date);
        const dateNowStub = jest.fn(() => 123);
        global.Date.now = dateNowStub;

        const algorithmDefinition = getAlgorithmDefinitions("Centralities", "Degree", "1.3.1");
        const parameters = {
            config: {

            }
        }
        let queries = constructQueries(algorithmDefinition, parameters, algorithmDefinition.streamQuery);

        expect(queries.storeAlgorithmNamedGraph).toEqual('CALL gds.alpha.degree.write("in-memory-graph-123", {})')
        expect(queries.streamAlgorithmNamedGraph).toEqual(`CALL gds.alpha.degree.stream("in-memory-graph-123", {}) YIELD nodeId, score
WITH gds.util.asNode(nodeId) AS node, score
RETURN node, score
ORDER BY score DESC
LIMIT toInteger($limit)`)
        expect(queries.createGraph).toEqual('CALL gds.graph.create("in-memory-graph-123", $config.nodeProjection, $config.relationshipProjection, {})')
        expect(queries.dropGraph).toEqual('CALL gds.graph.drop("in-memory-graph-123")')
        expect(dateNowStub).toHaveBeenCalled();
        global.Date.now = realDateNow;
    })

    it('creates named graph query for community detection algorithm', () => {
        const realDateNow = Date.now.bind(global.Date);
        const dateNowStub = jest.fn(() => 123);
        global.Date.now = dateNowStub;

        const algorithmDefinition = getAlgorithmDefinitions("Community Detection", "Louvain", "1.3.1");
        const parameters = {
            config: {

            }
        }
        let queries = constructQueries(algorithmDefinition, parameters, algorithmDefinition.streamQuery);

        expect(queries.storeAlgorithmNamedGraph).toEqual('CALL gds.louvain.write("in-memory-graph-123", {})')
        expect(queries.streamAlgorithmNamedGraph).toEqual(`CALL gds.louvain.stream("in-memory-graph-123", {})
YIELD nodeId, communityId AS community, intermediateCommunityIds AS communities
WITH gds.util.asNode(nodeId) AS node, community, communities
RETURN node, community, communities
ORDER BY community
LIMIT toInteger($limit)`)
        expect(queries.createGraph).toEqual('CALL gds.graph.create("in-memory-graph-123", $config.nodeProjection, $config.relationshipProjection, {})')
        expect(queries.dropGraph).toEqual('CALL gds.graph.drop("in-memory-graph-123")')
        expect(dateNowStub).toHaveBeenCalled();
        global.Date.now = realDateNow;
    })

    it('creates named graph query for node similarity algorithm', () => {
        const realDateNow = Date.now.bind(global.Date);
        const dateNowStub = jest.fn(() => 123);
        global.Date.now = dateNowStub;

        const algorithmDefinition = getAlgorithmDefinitions("Similarity", "Jaccard", "1.3.1");
        const parameters = {
            config: {
                similarityCutoff: 0.7,
                degreeCutoff: 1,
            }
        }
        let queries = constructQueries(algorithmDefinition, parameters, algorithmDefinition.streamQuery());

        expect(queries.storeAlgorithmNamedGraph).toEqual('CALL gds.nodeSimilarity.write("in-memory-graph-123", {similarityCutoff: 0.7, degreeCutoff: 1})')
        expect(queries.streamAlgorithmNamedGraph).toEqual(`CALL gds.nodeSimilarity.stream("in-memory-graph-123", {similarityCutoff: 0.7, degreeCutoff: 1}) YIELD node1, node2, similarity
RETURN gds.util.asNode(node1) AS from, gds.util.asNode(node2) AS to, similarity
ORDER BY similarity DESC
LIMIT toInteger($limit)`)
        expect(queries.createGraph).toEqual('CALL gds.graph.create("in-memory-graph-123", $config.nodeProjection, $config.relationshipProjection, {})')
        expect(queries.dropGraph).toEqual('CALL gds.graph.drop("in-memory-graph-123")')

        expect(dateNowStub).toHaveBeenCalled();
        global.Date.now = realDateNow;
    })

    it('creates named graph query for shortest path algorithm', () => {
        const realDateNow = Date.now.bind(global.Date);
        const dateNowStub = jest.fn(() => 123);
        global.Date.now = dateNowStub;

        const algorithmDefinition = getAlgorithmDefinitions("Path Finding", "Shortest Path", "1.3.1");
        const parameters = {
            config: {
            }
        }
        let queries = constructQueries(algorithmDefinition, parameters, algorithmDefinition.streamQuery);

        expect(queries.streamAlgorithmNamedGraph).toEqual(`CALL db.propertyKeys() YIELD propertyKey MATCH (start) WHERE start[propertyKey] contains $startNode
WITH start
LIMIT 1
CALL db.propertyKeys() YIELD propertyKey MATCH (end) WHERE end[propertyKey] contains $endNode
WITH start, end
LIMIT 1
CALL gds.alpha.shortestPath.stream("in-memory-graph-123", {startNode: start, endNode: end})
YIELD nodeId, cost
RETURN gds.util.asNode(nodeId) AS node, cost;`)
        expect(queries.createGraph).toEqual('CALL gds.graph.create("in-memory-graph-123", $config.nodeProjection, $config.relationshipProjection, {})')
        expect(queries.dropGraph).toEqual('CALL gds.graph.drop("in-memory-graph-123")')

        expect(dateNowStub).toHaveBeenCalled();
        global.Date.now = realDateNow;
    })

    it('creates named graph query for A* algorithm', () => {
        const realDateNow = Date.now.bind(global.Date);
        const dateNowStub = jest.fn(() => 123);
        global.Date.now = dateNowStub;

        const algorithmDefinition = getAlgorithmDefinitions("Path Finding", "A*", "1.3.1");
        const parameters = {
            config: {
            }
        }
        let queries = constructQueries(algorithmDefinition, parameters, algorithmDefinition.streamQuery);

        expect(queries.streamAlgorithmNamedGraph).toEqual(`CALL db.propertyKeys() YIELD propertyKey MATCH (start) WHERE start[propertyKey] contains $startNode
WITH start
LIMIT 1
CALL db.propertyKeys() YIELD propertyKey MATCH (end) WHERE end[propertyKey] contains $endNode
WITH start, end
LIMIT 1
CALL gds.alpha.shortestPath.astar.stream("in-memory-graph-123", {startNode: start, endNode: end})
YIELD nodeId, cost
RETURN gds.util.asNode(nodeId) AS node, cost;`)
        expect(queries.createGraph).toEqual('CALL gds.graph.create("in-memory-graph-123", $config.nodeProjection, $config.relationshipProjection, {})')
        expect(queries.dropGraph).toEqual('CALL gds.graph.drop("in-memory-graph-123")')

        expect(dateNowStub).toHaveBeenCalled();
        global.Date.now = realDateNow;
    })

    it('creates named graph query for SSSP algorithm', () => {
        const realDateNow = Date.now.bind(global.Date);
        const dateNowStub = jest.fn(() => 123);
        global.Date.now = dateNowStub;

        const algorithmDefinition = getAlgorithmDefinitions("Path Finding", "Single Source Shortest Path", "1.3.1");
        const parameters = {
            config: {
            }
        }
        let queries = constructQueries(algorithmDefinition, parameters, algorithmDefinition.streamQuery);

        expect(queries.streamAlgorithmNamedGraph).toEqual(`CALL db.propertyKeys() YIELD propertyKey MATCH (start) WHERE start[propertyKey] contains $startNode
WITH start
LIMIT 1
CALL gds.alpha.shortestPath.deltaStepping.stream("in-memory-graph-123", {startNode: start, delta: $config.delta})
YIELD nodeId, distance AS cost
RETURN gds.util.asNode(nodeId) AS node, cost`)
        expect(queries.createGraph).toEqual('CALL gds.graph.create("in-memory-graph-123", $config.nodeProjection, $config.relationshipProjection, {})')
        expect(queries.dropGraph).toEqual('CALL gds.graph.drop("in-memory-graph-123")')

        expect(dateNowStub).toHaveBeenCalled();
        global.Date.now = realDateNow;
    })

})