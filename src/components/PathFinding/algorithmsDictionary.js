import {runAllPairsShortestPathAlgorithm, runStreamingAlgorithm} from "../../services/pathFinding"
import {pathFindingParams} from "../../services/queries";
import PathFindingResult from "./PathFindingResult";
import ShortestPathForm from "./ShortestPathForm";
import AStarForm from "./AStarForm";
import SingleSourceShortestPathForm from "./SingleSourceShortestPathForm";
import AllPairsShortestPathForm from "./AllPairsShortestPathForm";
import AllPairsShortestPathResult from "./AllPairsShortestPathResult";

const findStartEndNodes = () => `CALL db.propertyKeys() YIELD propertyKey MATCH (start) WHERE start[propertyKey] contains $startNode
WITH start
LIMIT 1
CALL db.propertyKeys() YIELD propertyKey MATCH (end) WHERE end[propertyKey] contains $endNode
WITH start, end
LIMIT 1
`

const findStartNode = () => `CALL db.propertyKeys() YIELD propertyKey MATCH (start) WHERE start[propertyKey] contains $startNode
WITH start
LIMIT 1
`



let algorithms = {
    "Shortest Path": {
        Form: ShortestPathForm,
        parametersBuilder: pathFindingParams,
        service: runStreamingAlgorithm,
        ResultView: PathFindingResult,
        parameters: {
            label: "*",
            relationshipType: "*",
            nodeQuery: null,
            relationshipQuery: null,
            direction: 'Undirected',
            persist: false,
            writeProperty: "louvain",
            defaultValue: 1.0,
            relationshipWeightProperty: "weight",

        },
        streamQuery: findStartEndNodes() + `WITH $config AS config, start, end
WITH config { .*, startNode: start, endNode: end} as config
CALL gds.alpha.shortestPath.stream(config)
YIELD nodeId, cost
RETURN gds.util.asNode(nodeId) AS node, cost`,
        namedGraphStreamQuery: (namedGraph) => findStartEndNodes() + `CALL gds.alpha.shortestPath.stream("${namedGraph}", {startNode: start, endNode: end})
YIELD nodeId, cost
RETURN gds.util.asNode(nodeId) AS node, cost;`,
        storeQuery: ``,
        getFetchQuery: () => "",
        description: `The Shortest Path algorithm calculates the shortest (weighted) path between a pair of nodes. `
    },
    "A*": {
        Form: AStarForm,
        parametersBuilder: pathFindingParams,
        service: runStreamingAlgorithm,
        ResultView: PathFindingResult,
        parameters: {
            label: "*",
            relationshipType: "*",
            nodeQuery: null,
            relationshipQuery: null,
            direction: 'Undirected',
            persist: false,
            writeProperty: "louvain",
            defaultValue: 1.0,
            relationshipWeightProperty: "weight",
            propertyKeyLat: "latitude",
            propertyKeyLon: "longitude",

        },
        streamQuery: findStartEndNodes() + `WITH $config AS config, start, end
WITH config { .*, startNode: start, endNode: end} as config
CALL gds.alpha.shortestPath.astar.stream(config)
YIELD nodeId, cost
RETURN gds.util.asNode(nodeId) AS node, cost`,
        namedGraphStreamQuery: (namedGraph) => findStartEndNodes() + `CALL gds.alpha.shortestPath.astar.stream("${namedGraph}", {startNode: start, endNode: end})
YIELD nodeId, cost
RETURN gds.util.asNode(nodeId) AS node, cost;`,
        storeQuery: ``,
        getFetchQuery: () => "",
        description: `The A* algorithm improves on the classic Dijkstra algorithm. by using a heuristic that guides the paths taken.`
    },
    "Single Source Shortest Path": {
        Form: SingleSourceShortestPathForm,
        parametersBuilder: pathFindingParams,
        service: runStreamingAlgorithm,
        ResultView: PathFindingResult,
        parameters: {
            label: "*",
            relationshipType: "*",
            nodeQuery: null,
            relationshipQuery: null,
            direction: 'Undirected',
            persist: false,
            defaultValue: 1.0,
            relationshipWeightProperty: "weight",

            delta: 3.0
        },
        streamQuery: findStartNode() + `WITH $config AS config, start
WITH config { .*, startNode: start} as config
CALL gds.alpha.shortestPath.deltaStepping.stream(config)
YIELD nodeId, distance AS cost
RETURN gds.util.asNode(nodeId) AS node, cost
LIMIT toInteger($limit)`,
        namedGraphStreamQuery: (namedGraph) => findStartNode() + `CALL gds.alpha.shortestPath.deltaStepping.stream("${namedGraph}", {startNode: start, delta: $config.delta})
YIELD nodeId, distance AS cost
RETURN gds.util.asNode(nodeId) AS node, cost`,
        storeQuery: ``,
        getFetchQuery: () => "",
        description: `The Single Source Shortest Path (SSSP) algorithm calculates the shortest (weighted) path from a node to all other nodes in the graph..`
    },
    "All Pairs Shortest Path": {
        Form: AllPairsShortestPathForm,
        parametersBuilder: pathFindingParams,
        service: runAllPairsShortestPathAlgorithm,
        ResultView: AllPairsShortestPathResult,
        parameters: {
            label: "*",
            relationshipType: "*",
            nodeQuery: null,
            relationshipQuery: null,
            direction: 'Undirected',
            persist: false,
            defaultValue: 1.0,
            relationshipWeightProperty: "weight",

        },
        streamQuery: `CALL gds.alpha.allShortestPaths.stream($config)
YIELD sourceNodeId, targetNodeId, distance AS cost
RETURN gds.util.asNode(sourceNodeId) AS source, gds.util.asNode(targetNodeId) AS target, cost
LIMIT toInteger($limit)`,
        storeQuery: ``,
        getFetchQuery: () => "",
        description: `The All Pairs Shortest Path (APSP) calculates the shortest (weighted) path between all pairs of nodes.`
    },

//         "Yen’s K-shortest paths": {
//             Form: ShortestPathForm,
//             parametersBuilder: pathFindingParams,
//             service: runStreamingAlgorithm,
//             ResultView: PathFindingResult,
//             parameters: {
//                 nodeQuery: null,
//                 relationshipQuery: null,
//                 direction: 'Both',
//                 persist: false,
//                 writeProperty: "louvain",
//                 defaultValue: 1.0,
//                 weightProperty: "weight",
//                 k: 3,
//                 concurrency: 8
//             },
//             streamQuery: `CALL db.propertyKeys() YIELD propertyKey MATCH (start) WHERE start[propertyKey] contains $startNode
// WITH start
// LIMIT 1
// CALL db.propertyKeys() YIELD propertyKey MATCH (end) WHERE end[propertyKey] contains $endNode
// WITH start, end
// LIMIT 1
// CALL algo.kShortestPaths.stream(start, end, $config.k, $config.weightProperty, $config)
// YIELD index, nodeIds, costs
// RETURN algo.getNodesById(nodeIds), costs`,
//             storeQuery: ``,
//             getFetchQuery: () => "",
//             description: `Yen’s K-shortest paths algorithm computes single-source K-shortest loopless paths for a graph with non-negative relationship weights.`
//         },

};
export default {
    algorithmList: () => {
        return [
            "Shortest Path",
            "A*",
            "Single Source Shortest Path",
            "All Pairs Shortest Path",
            // "Yen’s K-shortest paths"
            // "Balanced Triads"
        ]
    },
    algorithmDefinitions: algorithm => algorithms[algorithm],
}
