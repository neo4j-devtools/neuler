import React from "react"
import {runAlgorithm, runAllPairsShortestPathAlgorithm, runStreamingAlgorithm} from "../../services/pathFinding"
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
        "All Pairs Shortest Path"
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
                direction: 'Both',
                persist: false,
                writeProperty: "louvain",
                defaultValue: 0.99,
                weightProperty: "weight",
                concurrency: 8
            },
            streamQuery: `WITH algo.getNodeById($startNodeId) AS start, algo.getNodeById($endNodeId) AS end
CALL algo.shortestPath.stream(start, end, $config.weightProperty, $config)
YIELD nodeId, cost
RETURN algo.getNodeById(nodeId) AS node, cost`,
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
                direction: 'Both',
                persist: false,
                writeProperty: "louvain",
                defaultValue: 0.99,
                weightProperty: "weight",
                propertyKeyLat: "latitude",
                propertyKeyLon: "longitude",
                concurrency: 8
            },
            streamQuery: `WITH algo.getNodeById($startNodeId) AS start, algo.getNodeById($endNodeId) AS end
CALL algo.shortestPath.astar.stream(start, end, $config.weightProperty, $config.propertyKeyLat, $config.propertyKeyLon, $config)
YIELD nodeId, cost
RETURN algo.getNodeById(nodeId) AS node, cost`,
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
                direction: 'Both',
                persist: false,
                defaultValue: 0.99,
                weightProperty: "weight",
                concurrency: 8,
                delta: 3.0
            },
            streamQuery: `WITH algo.getNodeById($startNodeId) AS start
CALL algo.shortestPath.deltaStepping.stream(start, $config.weightProperty, $config.delta, $config)
YIELD nodeId, distance AS cost
RETURN algo.getNodeById(nodeId) AS node, cost
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
                defaultValue: 0.99,
                weightProperty: "weight",
                concurrency: 8,
                delta: 3.0
            },
            streamQuery: `WITH algo.getNodeById($startNodeId) AS start
CALL algo.allShortestPaths.stream($config.weightProperty, $config)
YIELD sourceNodeId, targetNodeId, distance AS cost
RETURN algo.getNodeById(sourceNodeId) AS source, algo.getNodeById(targetNodeId) AS target, cost
LIMIT $limit`,
            storeQuery: ``,
            getFetchQuery: () => "",
            description: `The All Pairs Shortest Path (APSP) calculates the shortest (weighted) path between all pairs of nodes.`
        },
    }
}
