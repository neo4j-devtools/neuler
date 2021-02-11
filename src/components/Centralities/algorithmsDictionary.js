import PageRankForm from './PageRankForm'
import {runAlgorithm, runHITSAlgorithm} from "../../services/centralities"
import {centralityParams, getFetchCypher, getFetchHITSCypher, streamQueryOutline} from '../../services/queries'
import BetweennesForm from "./BetweennesForm"
import DegreeForm from "./DegreeForm"
import ApproxBetweennessForm from "./ApproxBetweennessForm"
import React from "react"
import CentralityResult from "./CentralityResult"
import ClosenessCentralityForm from "./ClosenessCentralityForm"
import NewApproxBetweennessForm from "./NewApproxBetweennessForm"
import HITSResult from "./HITS/Result";
import HITSForm from "./HITS/Form";


let algorithms = {
  "Degree": {
    algorithmName: "gds.alpha.degree",
    Form: DegreeForm,
    service: runAlgorithm,
    ResultView: CentralityResult,
    parameters: {
      label: "*",
      relationshipType: "*",
      direction: 'Reverse',
      persist: false,
      writeProperty: "degree",
      defaultValue: 1.0,
      relationshipWeightProperty: null
    },
    parametersBuilder: centralityParams,
    streamQuery: streamQueryOutline(`CALL gds.alpha.degree.stream($config) YIELD nodeId, score`),
    storeQuery: `CALL gds.alpha.degree.write($config)`,
    getFetchQuery: getFetchCypher,
    description: `detects the number of direct connections a node has`
  },
  "HITS": {
    algorithmName: "gds.alpha.hits.stream",
    Form: HITSForm,
    service: runHITSAlgorithm,
    ResultView: HITSResult,
    parameters: {
      label: "*",
      relationshipType: "*",
      direction: 'Natural',
      persist: false,
      writeProperty: "pregel_",
      hitsIterations: 20,
      defaultValue: 1.0,
      relationshipWeightProperty: null
    },
    parametersBuilder: centralityParams,
    streamQuery: `CALL gds.alpha.hits.stream($config) YIELD nodeId, values
WITH gds.util.asNode(nodeId) AS node, values.auth AS authScore, values.hub AS hubScore
RETURN node, authScore, hubScore
ORDER BY authScore DESC
LIMIT toInteger($limit)`,
    storeQuery: `CALL gds.alpha.hits.write($config)`,
    getFetchQuery: getFetchHITSCypher,
    description: `link analysis algorithm that rates nodes based on two scores, a hub score and an authority score.`
  },
  "Eigenvector": {
    algorithmName: "gds.alpha.eigenvector",
    Form: PageRankForm,
    service: runAlgorithm,
    ResultView: CentralityResult,
    parameters: {
      label: "*",
      relationshipType: "*",
      direction: 'Natural',
      persist: false,
      writeProperty: "eigenvector",
      maxIterations: 20,
      defaultValue: 1.0,
      normalization: "none"
    },
    parametersBuilder: centralityParams,
    streamQuery: streamQueryOutline(`CALL gds.alpha.eigenvector.stream($config) YIELD nodeId, score`),
    storeQuery: `CALL gds.alpha.eigenvector.write($config)`,
    getFetchQuery: getFetchCypher,
    description: <div>Measures the <strong>transitive</strong> influence or connectivity of nodes</div>
  },
  "Page Rank": {
    algorithmName: "gds.pageRank",
    Form: PageRankForm,
    service: runAlgorithm,
    ResultView: CentralityResult,
    parameters: {
      label: "*",
      relationshipType: "*",
      direction: 'Natural',
      persist: false,
      writeProperty: "pagerank",
      dampingFactor: 0.85,
      maxIterations: 20,
      defaultValue: 1.0,
      relationshipWeightProperty: null
    },
    parametersBuilder: centralityParams,
    streamQuery: streamQueryOutline(`CALL gds.pageRank.stream($config) YIELD nodeId, score`),
    storeQuery: `CALL gds.pageRank.write($config)`,
    getFetchQuery: getFetchCypher,
    description: <div>Measures the <strong>transitive</strong> influence or connectivity of nodes</div>
  },
  'Article Rank': {
    algorithmName: "gds.alpha.articleRank",
    Form: PageRankForm,
    service: runAlgorithm,
    ResultView: CentralityResult,
    parameters: {
      label: "*",
      relationshipType: "*",
      direction: 'Natural',
      persist: false,
      writeProperty: "articlerank",
      dampingFactor: 0.85,
      maxIterations: 20,
      defaultValue: 1.0,
      relationshipWeightProperty: null
    },
    parametersBuilder: centralityParams,
    streamQuery: streamQueryOutline(`CALL gds.alpha.articleRank.stream($config) YIELD nodeId, score`),
    storeQuery: `CALL gds.alpha.articleRank.write($config)`,
    getFetchQuery: getFetchCypher,
    description: `a variant of the PageRank algorithm`
  },
  "Closeness": {
    algorithmName: "gds.alpha.closeness",
    Form: ClosenessCentralityForm,
    service: runAlgorithm,
    ResultView: CentralityResult,
    parameters: {       label: "*", relationshipType: "*", persist: false, writeProperty: "closeness", direction:"Natural"},
    parametersBuilder: centralityParams,
    streamQuery: streamQueryOutline(`CALL gds.alpha.closeness.stream($config) YIELD nodeId, centrality AS score`),
    storeQuery: `CALL gds.alpha.closeness.write($config)`,
    getFetchQuery: getFetchCypher,
    description: `detect nodes that are able to spread information very efficiently through a graph`
  },
  "Harmonic": {
    algorithmName: "gds.alpha.harmonic",
    Form: ClosenessCentralityForm,
    service: runAlgorithm,
    ResultView: CentralityResult,
    parameters: {       label: "*", relationshipType: "*", persist: false, writeProperty: "harmonic", direction:"Natural"},
    parametersBuilder: centralityParams,
    streamQuery: streamQueryOutline(`CALL gds.alpha.harmonic.stream($config) YIELD nodeId, centrality AS score`),
    storeQuery: `CALL gds.alpha.harmonic.stream($config)`,
    getFetchQuery: getFetchCypher,
    description: `a variant of closeness centrality, that was invented to solve the problem the original
-                  formula had when dealing with unconnected graphs.`
  }
};

const baseBetweenness = {
  Form: BetweennesForm,
  service: runAlgorithm,
  ResultView: CentralityResult,
  parameters: {
    label: "*",
    relationshipType: "*",
    direction: 'Natural',
    persist: false,
    writeProperty: "betweenness",
  },
  parametersBuilder: centralityParams,
  getFetchQuery: getFetchCypher,
  description: `a way of detecting the amount of influence a node has over the flow of information in a graph`
}

const baseApproxBetweenness = {
  service: runAlgorithm,
  ResultView: CentralityResult,
  parametersBuilder: centralityParams,
  getFetchQuery: getFetchCypher,
  description: `calculates shortest paths between a subset of nodes, unlike Betweenness which considers all pairs of nodes`
}

const oldApproxBetweenness = {
  Form: ApproxBetweennessForm,
  parameters: {
    label: "*",
    relationshipType: "*",
    strategy: "random",
    direction: "Natural",
    persist: false,
    maxDepth: null,
    probability: null,
    writeProperty: "approxBetweenness"
  },
  streamQuery: streamQueryOutline(`CALL gds.alpha.betweenness.sampled.stream($config) YIELD nodeId, centrality AS score`),
  storeQuery: `CALL gds.alpha.betweenness.sampled.write($config)`
}

const newApproxBetweenness = {
  Form: NewApproxBetweennessForm,
  parameters: {
    label: "*",
    relationshipType: "*",
    samplingSize: 100,
    direction: "Natural",
    persist: false,
    writeProperty: "approxBetweenness"
  },
  streamQuery: streamQueryOutline(`CALL gds.betweenness.stream($config) YIELD nodeId, score`),
  storeQuery: `CALL gds.betweenness.write($config)`
}

export default {
  algorithmList: (gdsVersion) => {
    const version = parseInt(gdsVersion.split(".")[1])

    const algorithms = [
      "Degree",
      "Eigenvector",
      "Page Rank",
      "Article Rank",
      "Betweenness",
      "Approx Betweenness",
      "Closeness"
    ];

    return version >= 5 ? algorithms.concat(["HITS"]) : algorithms;
  },
  algorithmDefinitions: (algorithm, gdsVersion) => {
    const version = gdsVersion.split(".")[1]
    switch (algorithm) {
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
        return Object.assign({}, baseApproxBetweenness, version > "2" ? newApproxBetweenness : oldApproxBetweenness)
      }
      default:
        return algorithms[algorithm]
    }
  },
}
