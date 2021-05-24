import {runAllPairsShortestPathAlgorithm, runStreamingAlgorithm} from "../../services/pathFinding"
import {onePoint5PathFindingParams, pre1Point5PathFindingParams} from "../../services/queries";
import PathFindingResult from "./PathFindingResult";
import ShortestPathForm from "./ShortestPathForm";
import AStarForm from "./1.5/AStarForm";
import SingleSourceShortestPathForm from "./SingleSourceShortestPathForm";
import AllPairsShortestPathForm from "./AllPairsShortestPathForm";
import AllPairsShortestPathResult from "./AllPairsShortestPathResult";
import OldAStarForm from "./AStarForm";

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

let baseAlgorithms = {
    "All Pairs Shortest Path": {
        Form: AllPairsShortestPathForm,
        parametersBuilder: pre1Point5PathFindingParams,
        service: runAllPairsShortestPathAlgorithm,
        ResultView: AllPairsShortestPathResult,
        parameters: {...commonParameters, ...{nodeQuery: null, relationshipQuery: null,}},
        streamQuery: `CALL gds.alpha.allShortestPaths.stream($config)
YIELD sourceNodeId, targetNodeId, distance AS cost
RETURN gds.util.asNode(sourceNodeId) AS source, gds.util.asNode(targetNodeId) AS target, cost
LIMIT toInteger($limit)`,
        storeQuery: ``,
        getFetchQuery: () => "",
        description: `The All Pairs Shortest Path (APSP) calculates the shortest (weighted) path between all pairs of nodes.`
    },
};

const pre1Point5Algorithms = {
    "Shortest Path": {
        Form: ShortestPathForm,
        parametersBuilder: pre1Point5PathFindingParams,
        service: runStreamingAlgorithm,
        ResultView: PathFindingResult,
        parameters: { ...commonParameters, ...{nodeQuery: null, relationshipQuery: null, writeProperty: "louvain",}},
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
        Form: OldAStarForm,
        parametersBuilder: pre1Point5PathFindingParams,
        service: runStreamingAlgorithm,
        ResultView: PathFindingResult,
        parameters: { ...commonParameters, ...{
                nodeQuery: null,
                relationshipQuery: null,
                propertyKeyLat: "latitude",
                propertyKeyLon: "longitude",
            }
        },
        streamQuery: findStartEndNodes() + `WITH $config AS config, start, end
WITH config { .*, startNode: start, endNode: end} as config
CALL gds.alpha.shortestPath.astar.stream(config)
YIELD nodeId, cost
RETURN gds.util.asNode(nodeId) AS node, cost`,
        namedGraphStreamQuery: (namedGraph) => findStartEndNodes() + `CALL gds.alpha.shortestPath.astar.stream("${namedGraph}", {
  startNode: start, 
  endNode: end, 
  propertyKeyLat: $config.propertyKeyLat, 
  propertyKeyLon: $config.propertyKeyLon,
  relationshipWeightProperty: $config.relationshipWeightProperty
})
YIELD nodeId, cost
RETURN gds.util.asNode(nodeId) AS node, cost`,
        storeQuery: ``,
        getFetchQuery: () => "",
        description: `The A* algorithm improves on the classic Dijkstra algorithm. by using a heuristic that guides the paths taken.`
    },
    "Single Source Shortest Path": {
        Form: SingleSourceShortestPathForm,
        parametersBuilder: pre1Point5PathFindingParams,
        service: runStreamingAlgorithm,
        ResultView: PathFindingResult,
        parameters: { ...commonParameters, ...{nodeQuery: null, relationshipQuery: null, delta: 3.0}},
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
}

const onePointFiveAlgorithms = {
    "Shortest Path": {
        Form: ShortestPathForm,
        parametersBuilder: pre1Point5PathFindingParams,
        service: runStreamingAlgorithm,
        ResultView: PathFindingResult,
        parameters: {...commonParameters, ...{nodeQuery: null, relationshipQuery: null,}},
        streamQuery: findStartEndNodes() + `WITH $config AS config, start, end
WITH config { .*, sourceNode: id(start), targetNode: id(end)} as config
CALL gds.beta.shortestPath.dijkstra.stream(config)
YIELD nodeIds, costs
UNWIND range(0, size(nodeIds)-1) AS index
RETURN gds.util.asNode(nodeIds[index]) AS node, costs[index] AS cost`,
        namedGraphStreamQuery: (namedGraph) => findStartEndNodes() + `CALL gds.beta.shortestPath.dijkstra.stream("${namedGraph}", {sourceNode: id(start), targetNode: id(end)})
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
CALL gds.beta.shortestPath.astar.stream(config)
YIELD targetNode, totalCost AS cost
RETURN gds.util.asNode(targetNode) AS node, cost`,
        namedGraphStreamQuery: (namedGraph) => findStartEndNodes() + `CALL gds.beta.shortestPath.astar.stream("${namedGraph}", {
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
CALL gds.beta.allShortestPaths.dijkstra.stream(config)
YIELD targetNode AS nodeId, totalCost AS cost
RETURN gds.util.asNode(nodeId) AS node, cost
LIMIT toInteger($limit)`,
        namedGraphStreamQuery: (namedGraph) => findStartNode() + `CALL gds.beta.allShortestPaths.dijkstra.stream("${namedGraph}", {sourceNode: id(start)})
YIELD targetNode AS nodeId, totalCost AS cost
RETURN gds.util.asNode(nodeId) AS node, cost`,
        storeQuery: ``,
        getFetchQuery: () => "",
        description: `The Single Source Shortest Path (SSSP) algorithm calculates the shortest (weighted) path from a node to all other nodes in the graph..`
    },
}

const onePointSixAlgorithms = {
    "Shortest Path": {
        Form: ShortestPathForm,
        parametersBuilder: pre1Point5PathFindingParams,
        service: runStreamingAlgorithm,
        ResultView: PathFindingResult,
        parameters: {...commonParameters, ...{nodeQuery: null, relationshipQuery: null,}},
        streamQuery: findStartEndNodes() + `WITH $config AS config, start, end
WITH config { .*, sourceNode: id(start), targetNode: id(end)} as config
CALL gds.shortestPath.dijkstra.stream(config)
YIELD nodeIds, costs
UNWIND range(0, size(nodeIds)-1) AS index
RETURN gds.util.asNode(nodeIds[index]) AS node, costs[index] AS cost`,
        namedGraphStreamQuery: (namedGraph) => findStartEndNodes() + `CALL gds.shortestPath.dijkstra.stream("${namedGraph}", {sourceNode: id(start), targetNode: id(end)})
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
CALL gds.shortestPath.astar.stream(config)
YIELD targetNode, totalCost AS cost
RETURN gds.util.asNode(targetNode) AS node, cost`,
        namedGraphStreamQuery: (namedGraph) => findStartEndNodes() + `CALL gds.shortestPath.astar.stream("${namedGraph}", {
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
CALL gds.allShortestPaths.dijkstra.stream(config)
YIELD targetNode AS nodeId, totalCost AS cost
RETURN gds.util.asNode(nodeId) AS node, cost
LIMIT toInteger($limit)`,
        namedGraphStreamQuery: (namedGraph) => findStartNode() + `CALL gds.allShortestPaths.dijkstra.stream("${namedGraph}", {sourceNode: id(start)})
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
        return {...baseAlgorithms, ...(version >= 6 ? onePointSixAlgorithms : version === 5 ? onePointFiveAlgorithms : pre1Point5Algorithms)}[algorithm]
    }
}
