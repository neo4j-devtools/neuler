import PageRankForm from './PageRankForm'
import {runAlgorithm, executeAlgorithm} from "../../services/centralities"
import { centralityParams, getFetchCypher, streamQueryOutline } from '../../services/queries'
import EigenvectorForm from './EigenvectorForm'
import ArticleRankForm from "./ArticleRankForm"
import BetweennesForm from "./BetweennesForm"
import DegreeForm from "./DegreeForm"
import ApproxBetweennessForm from "./ApproxBetweennessForm"
import {Card} from "semantic-ui-react/dist/commonjs/views/Card"
import React from "react"
import CentralityResult from "./CentralityResult"
import ClosenessCentralityForm from "./ClosenessCentralityForm"
import HarmonicCentralityForm from "./HarmonicCentralityForm"


export default {
  algorithmList: [
    "Degree",
    "Eigenvector",
    "Page Rank",
    "Article Rank",
    "Betweenness",
    "Approx Betweenness",
    "Closeness",
    "Harmonic"
  ],
  algorithmDefinitions: {
    "Degree": {
      Form: DegreeForm,
      service: runAlgorithm,
      ResultView: CentralityResult,
      parameters: {
        direction: 'Incoming',
        persist: true,
        writeProperty: "degree",
        defaultValue: 0.99,
        concurrency: 8,
        weightProperty: null
      },
      parametersBuilder: centralityParams,
      streamQuery: streamQueryOutline(`CALL algo.degree.stream($label, $relationshipType, $config) YIELD nodeId, score`),
      storeQuery: `CALL algo.degree($label, $relationshipType, $config)`,
      getFetchQuery: getFetchCypher,
      description: `detects the number of direct connections a node has`
    },
    "Eigenvector": {
      Form: EigenvectorForm,
      service: runAlgorithm,
      ResultView: CentralityResult,
      parameters: {
        direction: 'Outgoing',
        persist: true,
        writeProperty: "eigenvector",
        iterations: 20,
        defaultValue: 0.99,
        normalization: "none"
      },
      parametersBuilder: centralityParams,
      streamQuery: streamQueryOutline(`CALL algo.eigenvector.stream($label, $relationshipType, $config) YIELD nodeId, score`),
      storeQuery: `CALL algo.eigenvector($label, $relationshipType, $config)`,
      getFetchQuery: getFetchCypher,
      description: <div>Measures the <strong>transitive</strong> influence or connectivity of nodes</div>
    },
    "Page Rank": {
      Form: PageRankForm,
      service: runAlgorithm,
      ResultView: CentralityResult,
      parameters: {
        direction: 'Outgoing',
        persist: true,
        writeProperty: "pagerank",
        dampingFactor: 0.85,
        iterations: 20,
        defaultValue: 0.99,
        concurrency: 8,
        weightProperty: null
      },
      parametersBuilder: centralityParams,
      streamQuery: streamQueryOutline(`CALL algo.pageRank.stream($label, $relationshipType, $config) YIELD nodeId, score`),
      storeQuery: `CALL algo.pageRank($label, $relationshipType, $config)`,
      getFetchQuery: getFetchCypher,
      description: <div>Measures the <strong>transitive</strong> influence or connectivity of nodes</div>
    },
    'Article Rank': {
      Form: ArticleRankForm,
      service: runAlgorithm,
      ResultView: CentralityResult,
      parameters: {
        direction: 'Outgoing',
        persist: true,
        writeProperty: "articlerank",
        dampingFactor: 0.85,
        iterations: 20,
        defaultValue: 0.99,
        concurrency: 8,
        weightProperty: null
      },
      parametersBuilder: centralityParams,
      streamQuery: streamQueryOutline(`CALL algo.articleRank.stream($label, $relationshipType, $config) YIELD nodeId, score`),
      storeQuery: `CALL algo.articleRank($label, $relationshipType, $config)`,
      getFetchQuery: getFetchCypher,
      description: `a variant of the PageRank algorithm`
    },
    'Betweenness': {
      Form: BetweennesForm,
      service: runAlgorithm,
      ResultView: CentralityResult,
      parameters: {
        direction: 'Outgoing',
        persist: true,
        writeProperty: "betweenness",
        concurrency: 8
      },
      parametersBuilder: centralityParams,
      streamQuery: streamQueryOutline(`CALL algo.betweenness.stream($label, $relationshipType, $config) YIELD nodeId, centrality AS score`),
      storeQuery: `CALL algo.betweenness($label, $relationshipType, $config)`,
      getFetchQuery: getFetchCypher,
      description: `a way of detecting the amount of influence a node has over the flow of information in a graph`
    },
    'Approx Betweenness': {
      Form: ApproxBetweennessForm,
      service: runAlgorithm,
      ResultView: CentralityResult,
      parameters: {
        strategy: "random",
        direction: "Outgoing",
        persist: true,
        concurrency: 8,
        maxDepth: null,
        probability: null,
        writeProperty: "approxBetweenness"
      },
      parametersBuilder: centralityParams,
      streamQuery: streamQueryOutline(`CALL algo.betweenness.sampled.stream($label, $relationshipType, $config) YIELD nodeId, centrality AS score`),
      storeQuery: `CALL algo.betweenness.sampled($label, $relationshipType, $config)`,
      getFetchQuery: getFetchCypher,
      description: `calculates shortest paths between a subset of nodes, unlike Betweenness which considers all pairs of nodes`
    },
    "Closeness": {
      Form: ClosenessCentralityForm,
      service: runAlgorithm,
      ResultView: CentralityResult,
      parameters: { persist: true, writeProperty: "closeness", concurrency: 8, direction:"Outgoing"},
      parametersBuilder: centralityParams,
      streamQuery: streamQueryOutline(`CALL algo.closeness.stream($label, $relationshipType, $config) YIELD nodeId, centrality AS score`),
      storeQuery: `CALL algo.closeness($label, $relationshipType, $config)`,
      getFetchQuery: getFetchCypher,
      description: `detect nodes that are able to spread information very efficiently through a graph`
    },
    "Harmonic": {
      Form: HarmonicCentralityForm,
      service: runAlgorithm,
      ResultView: CentralityResult,
      parameters: { persist: true, writeProperty: "harmonic", concurrency: 8, direction:"Outgoing"},
      parametersBuilder: centralityParams,
      streamQuery: streamQueryOutline(`CALL algo.closeness.harmonic.stream($label, $relationshipType, $config) YIELD nodeId, centrality AS score`),
      storeQuery: `CALL algo.closeness.harmonic($label, $relationshipType, $config)`,
      getFetchQuery: getFetchCypher,
      description: `a variant of closeness centrality, that was invented to solve the problem the original
-                  formula had when dealing with unconnected graphs.`
    }
  }
}
