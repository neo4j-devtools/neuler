import React from "react"
import LouvainForm from "./LouvainForm"
import {
    connectedComponents,
    louvain,
    lpa,
    runAlgorithm,
    stronglyConnectedComponents,
    triangleCount,
    triangles
} from "../../services/communityDetection"
import CommunityResult from "./CommunityResult"
import LabelPropagationForm from "./LabelPropagationForm"
import {Card} from "semantic-ui-react/dist/commonjs/views/Card"
import ConnectedComponentsForm from "./ConnectedComponentsForm"
import StronglyConnectedComponentsForm from "./StronglyConnectedComponentsForm"
import TrianglesForm from "./TrianglesForm"
import TriangleCountForm from "./TriangleCountForm"
import TrianglesResult from "./TrianglesResult"
import LouvainResult from "./LouvainResult"
import TriangleCountResult from "./TriangleCountResult"
import {
    communityParams,
    communityStreamQueryOutline,
    getCommunityFetchCypher,
    getFetchLouvainCypher,
    getFetchTriangleCountCypher
} from "../../services/queries";

export default {
    algorithmList: [
        "Louvain",
        "Label Propagation",
        "Connected Components",
        "Strongly Connected Components",
        "Triangles",
        "Triangle Count",
        // "Balanced Triads"
    ],
    algorithmDefinitions: {
        "Louvain": {
            Form: LouvainForm,
            parametersBuilder: communityParams,
            service: runAlgorithm,
            ResultView: LouvainResult,
            parameters: {
                direction: 'Undirected',
                persist: true,
                writeProperty: "louvain",
                includeIntermediateCommunities: false,
                intermediateCommunitiesWriteProperty: "louvainIntermediate",
                defaultValue: 1.0,
                relationshipWeightProperty: null,
                seedProperty: null,
                concurrency: 8
            },
            streamQuery: `CALL gds.louvain.stream($config)
YIELD nodeId, communityId AS community, communityIds AS communities
WITH gds.util.asNode(nodeId) AS node, community, communities
RETURN node, community, communities
ORDER BY community
LIMIT $limit`,
            storeQuery: `CALL gds.louvain.write($config)`,
            getFetchQuery: getFetchLouvainCypher,
            description: `one of the fastest modularity-based algorithms and also reveals a hierarchy of communities at different scales`
        },
        "Label Propagation": {
            Form: LabelPropagationForm,
            parametersBuilder: communityParams,
            service: runAlgorithm,
            ResultView: CommunityResult,
            parameters: {
                direction: 'Undirected',
                persist: true,
                writeProperty: "lpa",
                defaultValue: 1.0,
                concurrency: 8,
                relationshipWeightProperty: null
            },
            streamQuery: communityStreamQueryOutline(`CALL gds.labelPropagation.stream($config) YIELD nodeId, communityId AS community`),
            storeQuery: `CALL gds.labelPropagation.write($config)`,
            getFetchQuery: getCommunityFetchCypher,
            description: "a fast algorithm for finding communities in a graph"
        },
        "Connected Components": {
            Form: ConnectedComponentsForm,
            parametersBuilder: communityParams,
            service: runAlgorithm,
            ResultView: CommunityResult,
            parameters: {
                persist: true,
                writeProperty: "unionFind",
                concurrency: 8,
                defaultValue: 1.0,
                direction: 'Both',
            },
            streamQuery: communityStreamQueryOutline(`CALL algo.unionFind.stream($label, $relationshipType, $config) YIELD nodeId, setId AS community`),
            storeQuery: `CALL algo.unionFind($label, $relationshipType, $config)`,
            getFetchQuery: getCommunityFetchCypher,
            description: "finds sets of connected nodes in an undirected graph where each node is reachable from any other node in the same set"
        },
        "Strongly Connected Components": {
            Form: StronglyConnectedComponentsForm,
            parametersBuilder: communityParams,
            service: runAlgorithm,
            ResultView: CommunityResult,
            parameters: {persist: true, writeProperty: "scc", concurrency: 8, defaultValue: 1.0, direction: 'Both',},
            streamQuery: communityStreamQueryOutline(`CALL algo.scc.stream($label, $relationshipType, $config) YIELD nodeId, partition AS community`),
            storeQuery: `CALL algo.scc($label, $relationshipType, $config)`,
            getFetchQuery: getCommunityFetchCypher,
            description: "finds sets of connected nodes in a directed graph where each node is reachable in both directions from any other node in the same set"
        },
        "Triangles": {
            Form: TrianglesForm,
            parametersBuilder: communityParams,
            service: triangles,
            ResultView: TrianglesResult,
            parameters: {persist: false, direction: 'Both'},
            streamQuery: `CALL algo.triangle.stream($label, $relationshipType, $config)
YIELD nodeA, nodeB, nodeC
RETURN algo.getNodeById(nodeA) AS nodeA, algo.getNodeById(nodeB) AS nodeB, algo.getNodeById(nodeC) AS nodeC
LIMIT $limit`,
            storeQuery: ``,
            getFetchQuery: () => ``,
            description: "finds set of three nodes, where each node has a relationship to all other nodes"
        },
        "Triangle Count": {
            Form: TriangleCountForm,
            parametersBuilder: communityParams,
            service: triangleCount,
            ResultView: TriangleCountResult,
            parameters: {
                persist: true,
                writeProperty: "trianglesCount",
                clusteringCoefficientProperty: "clusteringCoefficient",
                concurrency: 8,
                direction: "Both"
            },
            streamQuery: `CALL algo.triangleCount.stream($label, $relationshipType, $config)
YIELD nodeId, triangles, coefficient
WITH algo.getNodeById(nodeId) AS node, coefficient, triangles
RETURN node, triangles, coefficient
ORDER BY triangles DESC
LIMIT $limit`,
            storeQuery: `CALL algo.triangleCount($label, $relationshipType, $config)`,
            getFetchQuery: getFetchTriangleCountCypher,
            description: "finds set of three nodes, where each node has a relationship to all other nodes"
        }/*,
    "Balanced Triads": {
      Form: BalancedTriadsForm,
      service: balancedTriads,
      ResultView: BalancedTriadsResult,
      parameters: { persist: true, balancedProperty: "balanced", unbalancedProperty: "unbalanced", concurrency: 8, direction: 'Both'},
      description: "used to evaluate structural balance of the graph"
    }*/
    }
}
