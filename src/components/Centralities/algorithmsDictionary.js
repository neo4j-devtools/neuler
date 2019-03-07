import PageRankForm from './PageRankForm'
import { pageRank, articleRank, betweenness, approxBetweenness, closeness, harmonic, degree } from "../../services/centralities"
import ArticleRankForm from "./ArticleRankForm"
import BetweennesForm from "./BetweennesForm"
import DegreeForm from "./DegreeForm"
import ApproxBetweennessForm from "./ApproxBetweennessForm"
import { Card } from "semantic-ui-react/dist/commonjs/views/Card"
import React from "react"
import CentralityResult from "./CentralityResult"
import ClosenessCentralityForm from "./ClosenessCentralityForm"
import HarmonicCentralityForm from "./HarmonicCentralityForm"


export default {
  algorithmList: [
    "Degree",
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
      service: degree,
      ResultView: CentralityResult,
      parameters: {
        direction: 'Incoming',
        persist: true,
        writeProperty: "degree",
        defaultValue: 1.0
      },
      description: `detects the number of direct connections a node has`
    },
    "Page Rank": {
      Form: PageRankForm,
      service: pageRank,
      ResultView: CentralityResult,
      parameters: {
        direction: 'Outgoing',
        persist: true,
        writeProperty: "pagerank",
        dampingFactor: 0.85,
        iterations: 20,
        defaultValue: 1.0
      },
      description: <div>Measures the <strong>transitive</strong> influence or connectivity of
        nodes</div>
    },
    'Article Rank': {
      Form: ArticleRankForm,
      service: articleRank,
      ResultView: CentralityResult,
      parameters: {
        direction: 'Outgoing',
        persist: true,
        writeProperty: "articlerank",
        dampingFactor: 0.85,
        iterations: 20,
        defaultValue: 1.0
      },
      description: `a variant of the PageRank algorithm`
    },
    'Betweenness': {
      Form: BetweennesForm,
      service: betweenness,
      ResultView: CentralityResult,
      parameters: {
        direction: 'Outgoing',
        persist: true,
        writeProperty: "betweenness"
      },
      description: `a way of detecting the amount of influence a node has over the flow of information in a graph`
    },
    'Approx Betweenness': {
      Form: ApproxBetweennessForm,
      service: approxBetweenness,
      ResultView: CentralityResult,
      parameters: {
        strategy: "random",
        direction: "Outgoing",
        persist: true
      },
      description: `calculates shortest paths between a subset of nodes, unlike Betweenness which considers all pairs of nodes`
    },
    "Closeness": {
      Form: ClosenessCentralityForm,
      service: closeness,
      ResultView: CentralityResult,
      parameters: { persist: true},
      description: `detect nodes that are able to spread information very efficiently through a graph`
    },
    "Harmonic": {
      Form: HarmonicCentralityForm,
      service: harmonic,
      ResultView: CentralityResult,
      parameters: { persist: true},
      description: `a variant of closeness centrality, that was invented to solve the problem the original
-                  formula had when dealing with unconnected graphs.`
    }
  }
}
