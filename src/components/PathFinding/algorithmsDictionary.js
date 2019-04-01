import React from "react"
import {runAlgorithm} from "../../services/pathFinding"
import {Card} from "semantic-ui-react/dist/commonjs/views/Card"
import {pathFindingParams} from "../../services/queries";
import PathFindingResult from "./PathFindingResult";
import ShortestPathForm from "./ShortestPathForm";
import AStarForm from "./AStarForm";

export default {
    algorithmList: [
        "Shortest Path",
        "A*"
        // "Balanced Triads"
    ],
    algorithmDefinitions: {
        "Shortest Path": {
            Form: ShortestPathForm,
            parametersBuilder: pathFindingParams,
            service: runAlgorithm,
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
            service: runAlgorithm,
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
    }
}
