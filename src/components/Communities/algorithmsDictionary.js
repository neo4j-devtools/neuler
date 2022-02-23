import LouvainForm from "./LouvainForm"
import {
  localClusteringCoefficient,
  runAlgorithm, runSpeakerListenerLPA,
  triangleCountNew,
  triangles
} from "../../services/communityDetection"
import CommunityResult from "./CommunityResult"
import LabelPropagationForm from "./LabelPropagationForm"
import ConnectedComponentsForm from "./ConnectedComponentsForm"
import StronglyConnectedComponentsForm from "./StronglyConnectedComponentsForm"
import TrianglesForm from "./TrianglesForm"
import TrianglesResult from "./TrianglesResult"
import LouvainResult from "./LouvainResult"
import {
  communityParams,
  communityStreamQueryOutline,
  getCommunityFetchCypher,
  getFetchLouvainCypher,
  getFetchNewLocalClusteringCoefficientCypher,
  getFetchNewTriangleCountCypher, getFetchSLLPACypher,
} from "../../services/queries";
import NewTriangleCountResult from "./NewTriangleCountResult";
import NewTriangleCountForm from "./NewTriangleCountForm";
import LocalClusteringCoefficientResult from "./LocalClusteringCoefficientResult";
import NewLocalClusteringCoefficientForm from "./NewLocalClusteringCoefficientForm";
import ModularityOptimizationForm from "./ModularityOptimizationForm";
import K1ColoringForm from "./K1ColoringForm";
import SLLPAForm from "./SLLPA/Form";
import SLLPAResult from "./SLLPA/Result";

const removeSpacing = (query) => query.replace(/^[^\S\r\n]+|[^\S\r\n]+$/gm, "")

const commonParameters = {
  label: "*",
  relationshipType: "*",
  persist: false,
  direction: 'Undirected'
}

const commonRelWeightParameters = {
  ...commonParameters, ...{
    defaultValue: 1.0,
    relationshipWeightProperty: null,
  }
}

let algorithms = {
  "Louvain": {
    algorithmName: "gds.louvain",
    Form: LouvainForm,
    parametersBuilder: communityParams,
    service: runAlgorithm,
    ResultView: LouvainResult,
    parameters: {
      ...commonRelWeightParameters, ...{
        writeProperty: "louvain",
        includeIntermediateCommunities: false,
        intermediateCommunitiesWriteProperty: "louvainIntermediate",
        seedProperty: null,
      }
    },
    streamQuery: `CALL gds.louvain.stream($generatedName, $config)
YIELD nodeId, communityId AS community, intermediateCommunityIds AS communities
WITH gds.util.asNode(nodeId) AS node, community, communities
WITH community, communities, collect(node) AS nodes
RETURN community, communities, nodes[0..$communityNodeLimit] AS nodes, size(nodes) AS size
ORDER BY size DESC
LIMIT toInteger($limit)`,
    storeQuery: `CALL gds.louvain.write($generatedName, $config)`,
    getFetchQuery: getFetchLouvainCypher,
    description: `one of the fastest modularity-based algorithms and also reveals a hierarchy of communities at different scales`,
    returnsCommunities: true
  },
  "SLLPA": {
    algorithmName: "gds.alpha.sllpa",
    Form: SLLPAForm,
    parametersBuilder: communityParams,
    service: runSpeakerListenerLPA,
    ResultView: SLLPAResult,
    parameters: {
      ...commonRelWeightParameters, ...{
        writeProperty: "pregel_",
        maxIterations: 10,
        minAssociationStrength: 0.1
      }
    },
    streamQuery: `CALL gds.alpha.sllpa.stream($config)
YIELD nodeId, values        
WITH gds.util.asNode(nodeId) AS node, values.communityIds AS communities
WITH communities, collect(node) AS nodes
RETURN communities, nodes[0..$communityNodeLimit] AS nodes, size(nodes) AS size
ORDER BY size DESC
LIMIT toInteger($limit)`,
    storeQuery: `CALL gds.alpha.sllpa.write($config)`,
    getFetchQuery: getFetchSLLPACypher,
    description: `variation of the Label Propagation algorithm that is able to detect multiple communities per node.`,
    returnsCommunities: true
  },
  "Modularity Optimization": {
    algorithmName: "gds.beta.modularityOptimization",
    Form: ModularityOptimizationForm,
    parametersBuilder: communityParams,
    service: runAlgorithm,
    ResultView: CommunityResult,
    parameters: {
      ...commonRelWeightParameters, ...{
        writeProperty: "modularityOptimization",
        seedProperty: null,
        maxIterations: 10,
        tolerance: 0.0001
      }
    },
    streamQuery: communityStreamQueryOutline(`CALL gds.beta.modularityOptimization.stream($generatedName, $config) YIELD nodeId, communityId AS community`),
    storeQuery: `CALL gds.beta.modularityOptimization.write($generatedName, $config)`,
    getFetchQuery: getCommunityFetchCypher,
    description: `detect communities in the graph based on their modularity.`,
    returnsCommunities: true
  },
  "K1-Coloring": {
    algorithmName: "gds.beta.k1coloring",
    Form: K1ColoringForm,
    parametersBuilder: communityParams,
    service: runAlgorithm,
    ResultView: CommunityResult,
    parameters: {
      ...commonRelWeightParameters, ...{
        writeProperty: "k1Coloring",
        maxIterations: 10
      }
    },
    streamQuery: communityStreamQueryOutline(`CALL gds.beta.k1coloring.stream($generatedName, $config) YIELD nodeId, color AS community`),
    storeQuery: `CALL gds.beta.k1coloring.write($generatedName, $config)`,
    getFetchQuery: getCommunityFetchCypher,
    description: `assigns a color to each node trying to use as few colours as possible and making sure neighbors of a node have a different color to that node.`,
    returnsCommunities: true
  },
  "Label Propagation": {
    algorithmName: "gds.labelPropagation",
    Form: LabelPropagationForm,
    parametersBuilder: communityParams,
    service: runAlgorithm,
    ResultView: CommunityResult,
    parameters: {...commonRelWeightParameters, ...{writeProperty: "lpa"}},
    streamQuery: communityStreamQueryOutline(`CALL gds.labelPropagation.stream($generatedName, $config) YIELD nodeId, communityId AS community`),
    storeQuery: `CALL gds.labelPropagation.write($generatedName, $config)`,
    getFetchQuery: getCommunityFetchCypher,
    description: "a fast algorithm for finding communities in a graph",
    returnsCommunities: true
  },
  "Connected Components": {
    algorithmName: "gds.wcc",
    Form: ConnectedComponentsForm,
    parametersBuilder: communityParams,
    service: runAlgorithm,
    ResultView: CommunityResult,
    parameters: {
      ...commonParameters, ...{
        writeProperty: "unionFind",
        defaultValue: 1.0
      }
    },
    streamQuery: communityStreamQueryOutline(`CALL gds.wcc.stream($generatedName, $config) YIELD nodeId, componentId AS community`),
    storeQuery: `CALL gds.wcc.write($generatedName, $config)`,
    getFetchQuery: getCommunityFetchCypher,
    description: "finds sets of connected nodes in an undirected graph where each node is reachable from any other node in the same set",
    returnsCommunities: true
  },
  "Strongly Connected Components": {
    algorithmName: "gds.alpha.scc",
    Form: StronglyConnectedComponentsForm,
    parametersBuilder: communityParams,
    service: runAlgorithm,
    ResultView: CommunityResult,
    parameters: { ...commonParameters, ...{ writeProperty: "scc", defaultValue: 1.0} },
    streamQuery: communityStreamQueryOutline(`CALL gds.alpha.scc.stream($generatedName, $config) YIELD nodeId, componentId AS community`),
    storeQuery: `CALL gds.alpha.scc.write($generatedName, $config)`,
    getFetchQuery: getCommunityFetchCypher,
    description: "finds sets of connected nodes in a directed graph where each node is reachable in both directions from any other node in the same set",
    returnsCommunities: true
  },
  "Local Clustering Coefficient": {
    algorithmName: "gds.localClusteringCoefficient",
    parametersBuilder: communityParams,
    ResultView: LocalClusteringCoefficientResult,
    service: localClusteringCoefficient,
    description: "describes the likelihood that the neighbours of node are also connected",
    Form: NewLocalClusteringCoefficientForm,
    streamQuery: removeSpacing(`CALL gds.localClusteringCoefficient.stream($generatedName, $config)
          YIELD nodeId, localClusteringCoefficient AS coefficient
          WITH gds.util.asNode(nodeId) AS node, coefficient
          RETURN node, coefficient
          ORDER BY coefficient DESC
          LIMIT toInteger($limit)`),
    storeQuery: `CALL gds.localClusteringCoefficient.write($generatedName, $config)`,
    parameters: { ...commonParameters, ...{writeProperty: "coefficient"}},
    getFetchQuery: getFetchNewLocalClusteringCoefficientCypher
  },
  "Triangle Count": {
    algorithmName: "gds.triangleCount",
    Form: NewTriangleCountForm,
    service: triangleCountNew,
    ResultView: NewTriangleCountResult,
    streamQuery: removeSpacing(`CALL gds.triangleCount.stream($generatedName, $config)
          YIELD nodeId, triangleCount AS triangles
          WITH gds.util.asNode(nodeId) AS node, triangles
          RETURN node, triangles
          ORDER BY triangles DESC
          LIMIT toInteger($limit)`),
    storeQuery: `CALL gds.triangleCount.write($generatedName, $config)`,
    parameters: { ...commonParameters, ...{ writeProperty: "trianglesCount", }},
    getFetchQuery: getFetchNewTriangleCountCypher,
    parametersBuilder: communityParams,
    description: "finds set of three nodes, where each node has a relationship to all other nodes"

  }
};

const baseTriangles = {
  Form: TrianglesForm,
  parametersBuilder: communityParams,
  service: triangles,
  ResultView: TrianglesResult,
  parameters: commonParameters,
  storeQuery: ``,
  getFetchQuery: () => ``,
  description: "finds set of three nodes, where each node has a relationship to all other nodes"
}

export default {
  algorithmList: (gdsVersion) => {
    const version = parseInt(gdsVersion.split(".")[1])

    const algorithms = [
      "Louvain",
      "Modularity Optimization",
      "Label Propagation",
      "K1-Coloring",
      "Connected Components",
      "Strongly Connected Components",
      "Triangles",
      "Triangle Count",
      "Local Clustering Coefficient",
      "SLLPA"
    ]
    return algorithms;
    //return version >= 5 ? algorithms.concat(["SLLPA"]) : algorithms;
  },
  algorithmDefinitions: (algorithm, gdsVersion) => {
    const version = parseInt(gdsVersion.split(".")[1])
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

        baseTriangles.streamQuery = removeSpacing(version > 1 ? newStreamQuery : oldStreamQuery)
        return baseTriangles
      }
      default:
        return algorithms[algorithm]
    }
  },
}
