import LouvainForm from "./LouvainForm"
import {
  localClusteringCoefficient,
  runAlgorithm,
  triangleCountNew,
  triangleCountOld,
  triangles
} from "../../services/communityDetection"
import CommunityResult from "./CommunityResult"
import LabelPropagationForm from "./LabelPropagationForm"
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
  getFetchLocalClusteringCoefficientCypher,
  getFetchLouvainCypher,
  getFetchNewLocalClusteringCoefficientCypher,
  getFetchNewTriangleCountCypher,
  getFetchTriangleCountCypher
} from "../../services/queries";
import NewTriangleCountResult from "./NewTriangleCountResult";
import NewTriangleCountForm from "./NewTriangleCountForm";
import LocalClusteringCoefficientForm from "./LocalClusteringCoefficientForm";
import LocalClusteringCoefficientResult from "./LocalClusteringCoefficientResult";
import NewLocalClusteringCoefficientForm from "./NewLocalClusteringCoefficientForm";
import ModularityOptimizationForm from "./ModularityOptimizationForm";
import K1ColoringForm from "./K1ColoringForm";

const removeSpacing = (query) => query.replace(/^[^\S\r\n]+|[^\S\r\n]+$/gm, "")

let algorithms = {
  "Louvain": {
    algorithmName: "gds.louvain",
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
    },
    streamQuery: `CALL gds.louvain.stream($config)
YIELD nodeId, communityId AS community, intermediateCommunityIds AS communities
WITH gds.util.asNode(nodeId) AS node, community, communities
WITH community, communities, collect(node) AS nodes
RETURN community, communities, nodes[0..$communityNodeLimit] AS nodes, size(nodes) AS size
ORDER BY size DESC
LIMIT toInteger($limit);`,
    storeQuery: `CALL gds.louvain.write($config)`,
    getFetchQuery: getFetchLouvainCypher,
    description: `one of the fastest modularity-based algorithms and also reveals a hierarchy of communities at different scales`
  },
  "Modularity Optimization": {
    algorithmName: "gds.beta.modularityOptimization",
    Form: ModularityOptimizationForm,
    parametersBuilder: communityParams,
    service: runAlgorithm,
    ResultView: CommunityResult,
    parameters: {
      direction: 'Undirected',
      persist: true,
      writeProperty: "modularityOptimization",
      defaultValue: 1.0,
      relationshipWeightProperty: null,
      seedProperty: null,
      maxIterations: 10,
      tolerance: 0.0001
    },
    streamQuery: communityStreamQueryOutline(`CALL gds.beta.modularityOptimization.stream($config) YIELD nodeId, communityId AS community`),
    storeQuery: `CALL gds.beta.modularityOptimization.write($config)`,
    getFetchQuery: getCommunityFetchCypher,
    description: `detect communities in the graph based on their modularity.`
  },
  "K1-Coloring": {
    algorithmName: "gds.beta.k1coloring",
    Form: K1ColoringForm,
    parametersBuilder: communityParams,
    service: runAlgorithm,
    ResultView: CommunityResult,
    parameters: {
      direction: 'Undirected',
      persist: true,
      writeProperty: "k1Coloring",
      defaultValue: 1.0,
      relationshipWeightProperty: null,
      maxIterations: 10
    },
    streamQuery: communityStreamQueryOutline(`CALL gds.beta.k1coloring.stream($config) YIELD nodeId, color AS community`),
    storeQuery: `CALL gds.beta.k1coloring.write($config)`,
    getFetchQuery: getCommunityFetchCypher,
    description: `assigns a color to each node trying to use as few colours as possible and making sure neighbors of a node have a different color to that node.`
  },
  "Label Propagation": {
    algorithmName: "gds.labelPropagation",
    Form: LabelPropagationForm,
    parametersBuilder: communityParams,
    service: runAlgorithm,
    ResultView: CommunityResult,
    parameters: {
      direction: 'Undirected',
      persist: true,
      writeProperty: "lpa",
      defaultValue: 1.0,
      relationshipWeightProperty: null
    },
    streamQuery: communityStreamQueryOutline(`CALL gds.labelPropagation.stream($config) YIELD nodeId, communityId AS community`),
    storeQuery: `CALL gds.labelPropagation.write($config)`,
    getFetchQuery: getCommunityFetchCypher,
    description: "a fast algorithm for finding communities in a graph"
  },
  "Connected Components": {
    algorithmName: "gds.wcc",
    Form: ConnectedComponentsForm,
    parametersBuilder: communityParams,
    service: runAlgorithm,
    ResultView: CommunityResult,
    parameters: {
      persist: true,
      writeProperty: "unionFind",
      defaultValue: 1.0,
      direction: 'Undirected',
    },
    streamQuery: communityStreamQueryOutline(`CALL gds.wcc.stream($config) YIELD nodeId, componentId AS community`),
    storeQuery: `CALL gds.wcc.write($config)`,
    getFetchQuery: getCommunityFetchCypher,
    description: "finds sets of connected nodes in an undirected graph where each node is reachable from any other node in the same set"
  },
  "Strongly Connected Components": {
    algorithmName: "gds.alpha.scc",
    Form: StronglyConnectedComponentsForm,
    parametersBuilder: communityParams,
    service: runAlgorithm,
    ResultView: CommunityResult,
    parameters: {persist: true, writeProperty: "scc", defaultValue: 1.0, direction: 'Undirected',},
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
  parameters: {persist: false, direction: 'Undirected'},
  storeQuery: ``,
  getFetchQuery: () => ``,
  description: "finds set of three nodes, where each node has a relationship to all other nodes"
}

const baseTriangleCount = {
  parametersBuilder: communityParams,
  description: "finds set of three nodes, where each node has a relationship to all other nodes"
}

const oldTriangleCount = {
  algorithmName: "gds.alpha.triangleCount",
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
    direction: "Undirected"
  },
  getFetchQuery: getFetchTriangleCountCypher,
}

const newTriangleCount = {
  algorithmName: "gds.triangleCount",
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
    direction: "Undirected"
  },
  getFetchQuery: getFetchNewTriangleCountCypher
}

const baseLocalClusteringCoefficient = {
  parametersBuilder: communityParams,
  ResultView: LocalClusteringCoefficientResult,
  service: localClusteringCoefficient,
  description: "describes the likelihood that the neighbours of node are also connected"
}

const oldLocalClusteringCoefficient = {
  algorithmName: "gds.alpha.triangleCount",
  Form: LocalClusteringCoefficientForm,
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
    direction: "Undirected"
  },
  getFetchQuery: getFetchLocalClusteringCoefficientCypher
}

const newLocalClusteringCoefficient = {
  algorithmName: "gds.localClusteringCoefficient",
  Form: NewLocalClusteringCoefficientForm,
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
    direction: "Undirected"
  },
  getFetchQuery: getFetchNewLocalClusteringCoefficientCypher
}

export default {
  algorithmList: [
    "Louvain",
    "Modularity Optimization",
    "Label Propagation",
    "K1-Coloring",
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
        return Object.assign({}, baseLocalClusteringCoefficient, version > "1" ? newLocalClusteringCoefficient : oldLocalClusteringCoefficient)
      }
      default:
        return algorithms[algorithm]
    }
  },
}
