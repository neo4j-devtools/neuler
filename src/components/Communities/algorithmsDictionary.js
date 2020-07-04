import React from "react"
import LouvainForm from "./LouvainForm"
import {
  connectedComponents,
  louvain,
  lpa,
  runAlgorithm,
  stronglyConnectedComponents,
  triangleCount, triangleCountNew, triangleCountOld,
  triangles, localClusteringCoefficient
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
  getFetchLouvainCypher, getFetchNewTriangleCountCypher,
  getFetchTriangleCountCypher,
  getFetchLocalClusteringCoefficientCypher,
  getFetchNewLocalClusteringCoefficientCypher
} from "../../services/queries";
import NewTriangleCountResult from "./NewTriangleCountResult";
import NewTriangleCountForm from "./NewTriangleCountForm";
import LocalClusteringCoefficientForm from "./LocalClusteringCoefficientForm";
import LocalClusteringCoefficientResult from "./LocalClusteringCoefficientResult";
import NewLocalClusteringCoefficientForm from "./NewLocalClusteringCoefficientForm";

const removeSpacing = (query) => query.replace(/^[^\S\r\n]+|[^\S\r\n]+$/gm, "")

let algorithms = {
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
YIELD nodeId, communityId AS community, intermediateCommunityIds AS communities
WITH gds.util.asNode(nodeId) AS node, community, communities
RETURN node, community, communities
ORDER BY community
LIMIT toInteger($limit)`,
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
      direction: 'Undirected',
    },
    streamQuery: communityStreamQueryOutline(`CALL gds.wcc.stream($config) YIELD nodeId, componentId AS community`),
    storeQuery: `CALL gds.wcc.write($config)`,
    getFetchQuery: getCommunityFetchCypher,
    description: "finds sets of connected nodes in an undirected graph where each node is reachable from any other node in the same set"
  },
  "Strongly Connected Components": {
    Form: StronglyConnectedComponentsForm,
    parametersBuilder: communityParams,
    service: runAlgorithm,
    ResultView: CommunityResult,
    parameters: {persist: true, writeProperty: "scc", concurrency: 8, defaultValue: 1.0, direction: 'Undirected',},
    streamQuery: communityStreamQueryOutline(`CALL gds.alpha.scc.stream($config) YIELD nodeId, componentId AS community`),
    storeQuery: `CALL gds.alpha.scc.write($config)`,
    getFetchQuery: getCommunityFetchCypher,
    description: "finds sets of connected nodes in a directed graph where each node is reachable in both directions from any other node in the same set"
  }
  /*,
"Balanced Triads": {
Form: BalancedTriadsForm,
service: balancedTriads,
ResultView: BalancedTriadsResult,
parameters: { persist: true, balancedProperty: "balanced", unbalancedProperty: "unbalanced", concurrency: 8, direction: 'Both'},
description: "used to evaluate structural balance of the graph"
}*/
};


const baseTriangles = {
  Form: TrianglesForm,
  parametersBuilder: communityParams,
  service: triangles,
  ResultView: TrianglesResult,
  parameters: {persist: false, direction: 'Undirected', concurrency: 8},
  storeQuery: ``,
  getFetchQuery: () => ``,
  description: "finds set of three nodes, where each node has a relationship to all other nodes"
}

const baseTriangleCount = {
  parametersBuilder: communityParams,
  description: "finds set of three nodes, where each node has a relationship to all other nodes"
}

const oldTriangleCount = {
  Form: TriangleCountForm,
  service: triangleCountOld,
  ResultView: TriangleCountResult,
  streamQuery: removeSpacing(`CALL gds.alpha.triangleCount.stream($config)
        YIELD nodeId, triangles, coefficient
        WITH gds.util.asNode(nodeId) AS node, coefficient, triangles
        RETURN node, triangles, coefficient
        ORDER BY triangles DESC
        LIMIT toInteger($limit)`),
  storeQuery: `CALL gds.alpha.triangleCount.write($config)`,
  parameters: {
    persist: true,
    writeProperty: "trianglesCount",
    concurrency: 8,
    direction: "Undirected"
  },
  getFetchQuery: getFetchTriangleCountCypher,
}

const newTriangleCount = {
  Form: NewTriangleCountForm,
  service: triangleCountNew,
  ResultView: NewTriangleCountResult,
  streamQuery: removeSpacing(`CALL gds.triangleCount.stream($config)
        YIELD nodeId, triangleCount AS triangles
        WITH gds.util.asNode(nodeId) AS node, triangles
        RETURN node, triangles
        ORDER BY triangles DESC
        LIMIT toInteger($limit)`),
  storeQuery: `CALL gds.triangleCount.write($config)`,
  parameters: {
    persist: true,
    writeProperty: "trianglesCount",
    concurrency: 8,
    direction: "Undirected"
  },
  getFetchQuery: getFetchNewTriangleCountCypher
}

const oldLocalClusteringCoefficient = {
  Form: LocalClusteringCoefficientForm,
  service: localClusteringCoefficient,
  ResultView: LocalClusteringCoefficientResult,
  streamQuery: removeSpacing(`CALL gds.alpha.triangleCount.stream($config)
        YIELD nodeId, coefficient
        WITH gds.util.asNode(nodeId) AS node, coefficient
        RETURN node, coefficient
        ORDER BY coefficient DESC
        LIMIT toInteger($limit)`),
  storeQuery: `CALL gds.alpha.triangleCount.write($config)`,
  parameters: {
    persist: true,
    clusteringCoefficientProperty: "coefficient",
    concurrency: 8,
    direction: "Undirected"
  },
  getFetchQuery: getFetchLocalClusteringCoefficientCypher,
  description: "describes the likelihood that the neighbours of node are also connected"

}

const newLocalClusteringCoefficient = {
  Form: NewLocalClusteringCoefficientForm,
  service: localClusteringCoefficient,
  ResultView: LocalClusteringCoefficientResult,
  streamQuery: removeSpacing(`CALL gds.localClusteringCoefficient.stream($config)
        YIELD nodeId, localClusteringCoefficient AS coefficient
        WITH gds.util.asNode(nodeId) AS node, coefficient
        RETURN node, coefficient
        ORDER BY coefficient DESC
        LIMIT toInteger($limit)`),
  storeQuery: `CALL gds.localClusteringCoefficient.write($config)`,
  parameters: {
    persist: true,
    writeProperty: "coefficient",
    concurrency: 8,
    direction: "Undirected"
  },
  getFetchQuery: getFetchNewLocalClusteringCoefficientCypher,
  description: "describes the likelihood that the neighbours of node are also connected"

}

export default {
  algorithmList: [
    "Louvain",
    "Label Propagation",
    "Connected Components",
    "Strongly Connected Components",
    "Triangles",
    "Triangle Count",
    "Local Clustering Coefficient"
    // "Balanced Triads"
  ],
  algorithmDefinitions: (algorithm, gdsVersion) => {
    const version = gdsVersion.split(".")[1]
    switch (algorithm) {
      case "Triangles": {
        const oldStreamQuery = `CALL gds.alpha.triangle.stream($config)
                YIELD nodeA, nodeB, nodeC
                RETURN gds.util.asNode(nodeA) AS nodeA, gds.util.asNode(nodeB) AS nodeB, gds.util.asNode(nodeC) AS nodeC
                LIMIT toInteger($limit)`

        const newStreamQuery = `CALL gds.alpha.triangles($config)
                YIELD nodeA, nodeB, nodeC
                RETURN gds.util.asNode(nodeA) AS nodeA, gds.util.asNode(nodeB) AS nodeB, gds.util.asNode(nodeC) AS nodeC
                LIMIT toInteger($limit)`

        baseTriangles.streamQuery = removeSpacing(version > "1" ? newStreamQuery : oldStreamQuery)
        return baseTriangles
      }
      case "Triangle Count": {
        return Object.assign({}, baseTriangleCount, version > "1" ? newTriangleCount : oldTriangleCount)
      }
      case "Local Clustering Coefficient": {
        return Object.assign({}, baseTriangleCount, version > "1" ? newLocalClusteringCoefficient : oldLocalClusteringCoefficient)
      }
      default:
        return algorithms[algorithm]
    }
  },
}
