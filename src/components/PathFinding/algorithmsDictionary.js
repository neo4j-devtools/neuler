import React from "react"
import {runAllPairsShortestPathAlgorithm, runStreamingAlgorithm} from "../../services/pathFinding"
import {Card} from "semantic-ui-react/dist/commonjs/views/Card"
import {pathFindingParams} from "../../services/queries";
import PathFindingResult from "./PathFindingResult";
import ShortestPathForm from "./ShortestPathForm";
import AStarForm from "./AStarForm";
import SingleSourceShortestPathForm from "./SingleSourceShortestPathForm";
import AllPairsShortestPathForm from "./AllPairsShortestPathForm";
import AllPairsShortestPathResult from "./AllPairsShortestPathResult";

export default {
    algorithmList: [
        "Shortest Path",
        "A*",
        "Single Source Shortest Path",
        "All Pairs Shortest Path",
        // "Yen’s K-shortest paths"
        // "Balanced Triads"
    ],
    algorithmDefinitions: {
        "Shortest Path": {
            Form: ShortestPathForm,
            parametersBuilder: pathFindingParams,
            service: runStreamingAlgorithm,
            ResultView: PathFindingResult,
            parameters: {
                nodeQuery: null,
                relationshipQuery: null,
                direction: 'Undirected',
                persist: false,
                writeProperty: "louvain",
                defaultValue: 1.0,
                relationshipWeightProperty: "weight",
                concurrency: 8
            },
            streamQuery: `CALL db.propertyKeys() YIELD propertyKey MATCH (start) WHERE start[propertyKey] contains $startNode
WITH start
LIMIT 1
CALL db.propertyKeys() YIELD propertyKey MATCH (end) WHERE end[propertyKey] contains $endNode
WITH start, end
LIMIT 1        
WITH apoc.map.setKey($config, "startNode", start) AS config, end
WITH apoc.map.setKey(config, "endNode", end) AS config    
CALL gds.alpha.shortestPath.stream(config)
YIELD nodeId, cost
RETURN gds.util.asNode(nodeId) AS node, cost`,
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
                nodeQuery: null,
                relationshipQuery: null,
                direction: 'Undirected',
                persist: false,
                writeProperty: "louvain",
                defaultValue: 1.0,
                relationshipWeightProperty: "weight",
                propertyKeyLat: "latitude",
                propertyKeyLon: "longitude",
                concurrency: 8
            },
            streamQuery: `CALL db.propertyKeys() YIELD propertyKey MATCH (start) WHERE start[propertyKey] contains $startNode
WITH start
LIMIT 1
CALL db.propertyKeys() YIELD propertyKey MATCH (end) WHERE end[propertyKey] contains $endNode
WITH start, end
LIMIT 1        
WITH apoc.map.setKey($config, "startNode", start) AS config, end
WITH apoc.map.setKey(config, "endNode", end) AS config    
CALL gds.alpha.shortestPath.astar.stream(config)
YIELD nodeId, cost
RETURN gds.util.asNode(nodeId) AS node, cost`,
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
                nodeQuery: null,
                relationshipQuery: null,
                direction: 'Undirected',
                persist: false,
                defaultValue: 1.0,
                relationshipWeightProperty: "weight",
                concurrency: 8,
                delta: 3.0
            },
            streamQuery: `CALL db.propertyKeys() YIELD propertyKey
MATCH (start) WHERE start[propertyKey] contains $startNode
WITH start
LIMIT 1
WITH apoc.map.setKey($config, "startNode", start) AS config
CALL gds.alpha.shortestPath.deltaStepping.stream(config)
YIELD nodeId, distance AS cost
RETURN gds.util.asNode(nodeId) AS node, cost
LIMIT $limit`,
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
                nodeQuery: null,
                relationshipQuery: null,
                direction: 'Both',
                persist: false,
                defaultValue: 1.0,
                weightProperty: "weight",
                concurrency: 8,
            },
            streamQuery: `CALL algo.allShortestPaths.stream($config.weightProperty, $config)
YIELD sourceNodeId, targetNodeId, distance AS cost
RETURN algo.getNodeById(sourceNodeId) AS source, algo.getNodeById(targetNodeId) AS target, cost
LIMIT $limit`,
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

    }
}
