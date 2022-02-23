import PageRankForm from './PageRankForm'
import {runAlgorithm, runHITSAlgorithm} from "../../services/centralities"
import {centralityParams, getFetchCypher, getFetchHITSCypher, streamQueryOutline} from '../../services/queries'
import BetweennesForm from "./BetweennesForm"
import DegreeForm from "./DegreeForm"
import React from "react"
import CentralityResult from "./CentralityResult"
import ClosenessCentralityForm from "./ClosenessCentralityForm"
import NewApproxBetweennessForm from "./NewApproxBetweennessForm"
import HITSResult from "./HITS/Result";
import HITSForm from "./HITS/Form";
import EigenvectorForm from "./Eigenvector/Form"

const commonParameters = {
  label: "*",
  relationshipType: "*",
  persist: false,
  direction: 'Natural'
}

let algorithms = {
  "HITS": {
    algorithmName: "gds.alpha.hits.stream",
    Form: HITSForm,
    service: runHITSAlgorithm,
    ResultView: HITSResult,
    parameters: {
      ...commonParameters,
      ...{ writeProperty: "pregel_",  hitsIterations: 20, defaultValue: 1.0,  relationshipWeightProperty: null}
    },
    parametersBuilder: centralityParams,
    streamQuery: `CALL gds.alpha.hits.stream($generatedName, $config) YIELD nodeId, values
WITH gds.util.asNode(nodeId) AS node, values.auth AS authScore, values.hub AS hubScore
RETURN node, authScore, hubScore
ORDER BY authScore DESC
LIMIT toInteger($limit)`,
    storeQuery: `CALL gds.alpha.hits.write($generatedName, $config)`,
    getFetchQuery: getFetchHITSCypher,
    description: `link analysis algorithm that rates nodes based on two scores, a hub score and an authority score.`
  },
  "Page Rank": {
    algorithmName: "gds.pageRank",
    Form: PageRankForm,
    service: runAlgorithm,
    ResultView: CentralityResult,
    parameters: {
      ...commonParameters,
      ...{ writeProperty: "pagerank", dampingFactor: 0.85, maxIterations: 20, defaultValue: 1.0, relationshipWeightProperty: null}
    },
    parametersBuilder: centralityParams,
    streamQuery: streamQueryOutline(`CALL gds.pageRank.stream($generatedName, $config) YIELD nodeId, score`),
    storeQuery: `CALL gds.pageRank.write($generatedName, $config)`,
    getFetchQuery: getFetchCypher,
    description: <div>Measures the <strong>transitive</strong> influence or connectivity of nodes</div>
  },
  "Closeness": {
    algorithmName: "gds.alpha.closeness",
    Form: ClosenessCentralityForm,
    service: runAlgorithm,
    ResultView: CentralityResult,
    parameters: {...commonParameters, ...{ writeProperty: "closeness", }},
    parametersBuilder: centralityParams,
    streamQuery: streamQueryOutline(`CALL gds.alpha.closeness.stream($generatedName, $config) YIELD nodeId, centrality AS score`),
    storeQuery: `CALL gds.alpha.closeness.write($generatedName, $config)`,
    getFetchQuery: getFetchCypher,
    description: `detect nodes that are able to spread information very efficiently through a graph`
  },
  "Harmonic": {
    algorithmName: "gds.alpha.harmonic",
    Form: ClosenessCentralityForm,
    service: runAlgorithm,
    ResultView: CentralityResult,
    parameters: {...commonParameters, ...{ writeProperty: "harmonic", }},
    parametersBuilder: centralityParams,
    streamQuery: streamQueryOutline(`CALL gds.alpha.harmonic.stream($config) YIELD nodeId, centrality AS score`),
    storeQuery: `CALL gds.alpha.harmonic.stream($config)`,
    getFetchQuery: getFetchCypher,
    description: `a variant of closeness centrality, that was invented to solve the problem the original
-                  formula had when dealing with unconnected graphs.`
  },
  "Degree": {
    algorithmName: "gds.degree",
    Form: DegreeForm,
    service: runAlgorithm,
    ResultView: CentralityResult,
    parameters: {
      ...commonParameters,
      ...{ direction: 'Reverse', writeProperty: "degree", defaultValue: 1.0, relationshipWeightProperty: null}
    },
    parametersBuilder: centralityParams,
    getFetchQuery: getFetchCypher,
    streamQuery: streamQueryOutline(`CALL gds.degree.stream($generatedName, $config) YIELD nodeId, score`),
    storeQuery: `CALL gds.degree.write($generatedName, $config)`,
    description: `detects the number of direct connections a node has`
  },
  "Eigenvector": {
    algorithmName: "gds.eigenvector",
    Form: EigenvectorForm,
    service: runAlgorithm,
    ResultView: CentralityResult,
    parameters: {
      ...commonParameters,
      ...{ writeProperty: "eigenvector", maxIterations: 20, defaultValue: 1.0}
    },
    parametersBuilder: centralityParams,
    getFetchQuery: getFetchCypher,
    description: <div>Measures the <strong>transitive</strong> influence or connectivity of nodes</div>,
    streamQuery: streamQueryOutline(`CALL gds.eigenvector.stream($generatedName, $config) YIELD nodeId, score`),
    storeQuery: `CALL gds.eigenvector.write($generatedName, $config)`
  },
  "Article Rank": {
    algorithmName: "gds.articleRank",
    Form: PageRankForm,
    service: runAlgorithm,
    ResultView: CentralityResult,
    parameters: {
      ...commonParameters,
      ...{ writeProperty: "articlerank", dampingFactor: 0.85, maxIterations: 20, defaultValue: 1.0, relationshipWeightProperty: null}
    },
    parametersBuilder: centralityParams,
    getFetchQuery: getFetchCypher,
    description: `a variant of the PageRank algorithm`,
    streamQuery: streamQueryOutline(`CALL gds.articleRank.stream($generatedName, $config) YIELD nodeId, score`),
    storeQuery: `CALL gds.articleRank.write($generatedName, $config)`
  },
  "Betweenness": {
    algorithmName: "gds.betweenness",
    Form: BetweennesForm,
    service: runAlgorithm,
    ResultView: CentralityResult,
    parameters: { ...commonParameters, ...{ writeProperty: "betweenness",}},
    parametersBuilder: centralityParams,
    getFetchQuery: getFetchCypher,
    description: `a way of detecting the amount of influence a node has over the flow of information in a graph`,
    streamQuery: streamQueryOutline(`CALL gds.betweenness.stream($generatedName, $config) YIELD nodeId, score`),
    storeQuery: `CALL gds.betweenness.write($generatedName, $config)`
  },
  "Approx Betweenness": {
    algorithmName: "gds.betweenness",
    service: runAlgorithm,
    ResultView: CentralityResult,
    parametersBuilder: centralityParams,
    getFetchQuery: getFetchCypher,
    description: `calculates shortest paths between a subset of nodes, unlike Betweenness which considers all pairs of nodes`,
    Form: NewApproxBetweennessForm,
    parameters: { ...commonParameters, ...{ samplingSize: 100, writeProperty: "approxBetweenness"}},
    streamQuery: streamQueryOutline(`CALL gds.betweenness.stream($generatedName, $config) YIELD nodeId, score`),
    storeQuery: `CALL gds.betweenness.write($generatedName, $config)`

  }
};

export default {
  algorithmList: (gdsVersion) => {
    const mainVersion = parseInt(gdsVersion.split(".")[0])
    const version = parseInt(gdsVersion.split(".")[1])
    const algorithms = ["Degree", "Eigenvector", "Page Rank", "Article Rank", "Betweenness", "Approx Betweenness", "Closeness", "HITS"];
    return algorithms
    //return version >= 5 ? algorithms.concat(["HITS"]) : algorithms;
  },
  algorithmDefinitions: (algorithm, gdsVersion) => {
    const mainVersion = parseInt(gdsVersion.split(".")[0])
    const version = parseInt(gdsVersion.split(".")[1])
    switch (algorithm) {
      /*
      case "Betweenness": {
        const oldStreamQuery = `CALL gds.alpha.betweenness.stream($config) YIELD nodeId, centrality AS score`
        const newStreamQuery = `CALL gds.betweenness.stream($config) YIELD nodeId, score`

        const oldStoreQuery = `CALL gds.alpha.betweenness.write($config)`
        const newStoreQuery = `CALL gds.betweenness.write($config)`

        baseBetweenness.streamQuery = streamQueryOutline(version > "2" ? newStreamQuery : oldStreamQuery)
        baseBetweenness.storeQuery = version > "2" ? newStoreQuery : oldStoreQuery

        return baseBetweenness
      }

      case "Approx Betweenness": {
        return Object.assign({}, baseApproxBetweenness, version > 2 ? newApproxBetweenness : oldApproxBetweenness)
      }
      */
      default:
        return algorithms[algorithm]
    }
  },
}
