import LouvainForm from "../Communities/LouvainForm"
import {runAlgorithm} from "../../services/communityDetection"
import LouvainResult from "../Communities/LouvainResult"
import {communityParams, getFetchLouvainCypher} from "../../services/queries";

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

const algorithms = {
  "Node2Vec": {
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
    streamQuery: `CALL gds.louvain.stream($config)
YIELD nodeId, communityId AS community, intermediateCommunityIds AS communities
WITH gds.util.asNode(nodeId) AS node, community, communities
WITH community, communities, collect(node) AS nodes
RETURN community, communities, nodes[0..$communityNodeLimit] AS nodes, size(nodes) AS size
ORDER BY size DESC
LIMIT toInteger($limit)`,
    storeQuery: `CALL gds.louvain.write($config)`,
    getFetchQuery: getFetchLouvainCypher,
    description: `one of the fastest modularity-based algorithms and also reveals a hierarchy of communities at different scales`,
    returnsCommunities: true
  },
};


export default {
  algorithmList: (gdsVersion) => {
      const version = parseInt(gdsVersion.split(".")[1])
      const algorithms = ["Node2Vec",]
      return algorithms
  },
    algorithmDefinitions: (algorithm, gdsVersion) => {
        const version = parseInt(gdsVersion.split(".")[1])
        return algorithms[algorithm]

    },
}
