import React from "react"
import LouvainForm from "./LouvainForm"
import {
    balancedTriads,
    connectedComponents,
    louvain,
    lpa,
    stronglyConnectedComponents,
    triangleCount,
    triangles,
    executeAlgorithm,
    runAlgorithm
} from "../../services/communityDetection"
import CommunityResult from "./CommunityResult"
import LabelPropagationForm from "./LabelPropagationForm"
import {Card} from "semantic-ui-react/dist/commonjs/views/Card"
import ConnectedComponentsForm from "./ConnectedComponentsForm"
import StronglyConnectedComponentsForm from "./StronglyConnectedComponentsForm"
import TrianglesForm from "./TrianglesForm"
import TriangleCountForm from "./TriangleCountForm"
import BalancedTriadsForm from "./BalancedTriadsForm"
import TrianglesResult from "./TrianglesResult"
import LouvainResult from "./LouvainResult"
import TriangleCountResult from "./TriangleCountResult"
import BalancedTriadsResult from "./BalancedTriadsResult"
import {communityParams, getFetchCypher, getFetchLouvainCypher} from "../../services/queries";

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
            service: runAlgorithm,
            ResultView: LouvainResult,
            parameters: {
                direction: 'Both',
                persist: true,
                writeProperty: "louvain",
                includeIntermediateCommunities: false,
                intermediateCommunitiesWriteProperty: "louvainIntermediate",
                defaultValue: 0.99,
                weightProperty: null,
                communityProperty: null,
                concurrency: 8
            },
            parametersBuilder: communityParams,
            streamQuery: `CALL algo.louvain.stream($label, $relationshipType, $config)
                          YIELD nodeId, community, communities
                          WITH algo.getNodeById(nodeId) AS node, community, communities
                          RETURN node, community, communities
                          ORDER BY community
                          LIMIT $limit`,
            storeQuery: `CALL algo.louvain($label, $relationshipType, $config)`,
            getFetchQuery: getFetchLouvainCypher,
            description: `one of the fastest modularity-based algorithms and also reveals a hierarchy of communities at different scales`
        },
        "Label Propagation": {
            Form: LabelPropagationForm,
            service: lpa,
            ResultView: CommunityResult,
            parameters: {
                direction: 'Both',
                persist: true,
                writeProperty: "lpa",
                defaultValue: 0.99,
                concurrency: 8
            },
            description: "a fast algorithm for finding communities in a graph"
        },
        "Connected Components": {
            Form: ConnectedComponentsForm,
            service: connectedComponents,
            ResultView: CommunityResult,
            parameters: {
                persist: true,
                writeProperty: "unionFind",
                concurrency: 8,
                defaultValue: 0.99,
                direction: 'Both',
            },
            description: "finds sets of connected nodes in an undirected graph where each node is reachable from any other node in the same set"
        },
        "Strongly Connected Components": {
            Form: StronglyConnectedComponentsForm,
            service: stronglyConnectedComponents,
            ResultView: CommunityResult,
            parameters: {persist: true, writeProperty: "scc", concurrency: 8, defaultValue: 0.99, direction: 'Both',},
            description: "finds sets of connected nodes in a directed graph where each node is reachable in both directions from any other node in the same set"
        },
        "Triangles": {
            Form: TrianglesForm,
            service: triangles,
            ResultView: TrianglesResult,
            parameters: {persist: true, direction: 'Both'},
            description: "finds set of three nodes, where each node has a relationship to all other nodes"
        },
        "Triangle Count": {
            Form: TriangleCountForm,
            service: triangleCount,
            ResultView: TriangleCountResult,
            parameters: {persist: true, writeProperty: "trianglesCount", concurrency: 8, direction: "Both"},
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
