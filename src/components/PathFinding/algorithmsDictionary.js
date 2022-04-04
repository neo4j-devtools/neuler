import {runAllPairsShortestPathAlgorithm, runStreamingAlgorithm} from "../../services/pathFinding"
import {onePoint5PathFindingParams, pre1Point5PathFindingParams} from "../../services/queries";
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

const commonParameters = {
    label: "*",
    relationshipType: "*",
    persist: false,
    direction: 'Undirected',
    defaultValue: 1.0,
    relationshipWeightProperty: "weight",

}

const algorithms = {
    "All Pairs Shortest Path": {
        Form: AllPairsShortestPathForm,
        parametersBuilder: pre1Point5PathFindingParams,
        service: runAllPairsShortestPathAlgorithm,
        ResultView: AllPairsShortestPathResult,
        parameters: {...commonParameters, ...{nodeQuery: null, relationshipQuery: null,}},
        streamQuery: `CALL gds.alpha.allShortestPaths.stream($generatedName, $config)
YIELD sourceNodeId, targetNodeId, distance AS cost
RETURN gds.util.asNode(sourceNodeId) AS source, gds.util.asNode(targetNodeId) AS target, cost
LIMIT toInteger($limit)`,
        storeQuery: ``,
        getFetchQuery: () => "",
        description: `The All Pairs Shortest Path (APSP) calculates the shortest (weighted) path between all pairs of nodes.`
    },
    "Shortest Path": {
        Form: ShortestPathForm,
        parametersBuilder: pre1Point5PathFindingParams,
        service: runStreamingAlgorithm,
        ResultView: PathFindingResult,
        parameters: {...commonParameters, ...{nodeQuery: null, relationshipQuery: null,}},
        streamQuery: findStartEndNodes() + `WITH $config AS config, start, end
WITH config { .*, sourceNode: id(start), targetNode: id(end)} as config
CALL gds.shortestPath.dijkstra.stream($generatedName, config)
YIELD nodeIds, costs
UNWIND range(0, size(nodeIds)-1) AS index
RETURN gds.util.asNode(nodeIds[index]) AS node, costs[index] AS cost`,
        namedGraphStreamQuery: findStartEndNodes() + `CALL gds.shortestPath.dijkstra.stream($generatedName, {sourceNode: start, targetNode: end})
YIELD nodeIds, costs
UNWIND range(0, size(nodeIds)-1) AS index
RETURN gds.util.asNode(nodeIds[index]) AS node, costs[index] AS cost`,
        storeQuery: ``,
        getFetchQuery: () => "",
        description: `The Shortest Path algorithm calculates the shortest (weighted) path between a pair of nodes. `
    },
    "A*": {
        Form: AStarForm,
        parametersBuilder: onePoint5PathFindingParams,
        service: runStreamingAlgorithm,
        ResultView: PathFindingResult,
        parameters: {
            ...commonParameters, ...{
                nodeQuery: null,
                relationshipQuery: null,
                writeProperty: "astar",
                latitudeProperty: "latitude",
                longitudeProperty: "longitude",
            }
        },
        streamQuery: findStartEndNodes() + `WITH $config AS config, start, end
WITH config { .*, sourceNode: id(start), targetNode: id(end)} as config
CALL gds.shortestPath.astar.stream($generatedName, config)
YIELD targetNode, totalCost AS cost
RETURN gds.util.asNode(targetNode) AS node, cost`,
        namedGraphStreamQuery: findStartEndNodes() + `CALL gds.shortestPath.astar.stream($generatedName, {
  sourceNode: id(start), 
  targetNode: id(end),
  latitudeProperty: $config.latitudeProperty, 
  longitudeProperty: $config.longitudeProperty,
  relationshipWeightProperty: $config.relationshipWeightProperty
})
YIELD targetNode, totalCost AS cost
RETURN gds.util.asNode(targetNode) AS node, cost`,
        storeQuery: ``,
        getFetchQuery: () => "",
        description: `The A* algorithm improves on the classic Dijkstra algorithm. by using a heuristic that guides the paths taken.`
    },
    "Single Source Shortest Path": {
        Form: SingleSourceShortestPathForm,
        parametersBuilder: onePoint5PathFindingParams,
        service: runStreamingAlgorithm,
        ResultView: PathFindingResult,
        parameters: { ...commonParameters, ...{nodeQuery: null, relationshipQuery: null,}},
        streamQuery: findStartNode() + `WITH $config AS config, start
WITH config { .*, sourceNode: id(start)} as config
CALL gds.allShortestPaths.dijkstra.stream($generatedName, config)
YIELD targetNode AS nodeId, totalCost AS cost
RETURN gds.util.asNode(nodeId) AS node, cost
LIMIT toInteger($limit)`,
        namedGraphStreamQuery: findStartNode() + `CALL gds.allShortestPaths.dijkstra.stream($generatedName, {sourceNode: id(start)})
YIELD targetNode AS nodeId, totalCost AS cost
RETURN gds.util.asNode(nodeId) AS node, cost`,
        storeQuery: ``,
        getFetchQuery: () => "",
        description: `The Single Source Shortest Path (SSSP) algorithm calculates the shortest (weighted) path from a node to all other nodes in the graph..`
    },
}

export default {
    algorithmList: () => {
        return ["Shortest Path", "A*", "Single Source Shortest Path", "All Pairs Shortest Path",]
    },
    algorithmDefinitions: (algorithm, gdsVersion)  => {
        const version = parseInt(gdsVersion.split(".")[1])
        return algorithms[algorithm]
    }
}
