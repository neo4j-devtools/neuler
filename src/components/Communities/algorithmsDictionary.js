import React from "react"
import LouvainForm from "./LouvainForm"
import {
  balancedTriads,
  connectedComponents,
  louvain,
  lpa,
  stronglyConnectedComponents,
  triangleCount,
  triangles
} from "../../services/communityDetection"
import CommunityResult from "./CommunityResult"
import LabelPropagationForm from "./LabelPropagationForm"
import { Card } from "semantic-ui-react/dist/commonjs/views/Card"
import ConnectedComponentsForm from "./ConnectedComponentsForm"
import StronglyConnectedComponentsForm from "./StronglyConnectedComponentsForm"
import TrianglesForm from "./TrianglesForm"
import TriangleCountForm from "./TriangleCountForm"
import BalancedTriadsForm from "./BalancedTriadsForm"
import TrianglesResult from "./TrianglesResult"
import TriangleCountResult from "./TriangleCountResult"
import BalancedTriadsResult from "./BalancedTriadsResult"

export default {
  algorithmList: [
    "Louvain",
    "Label Propagation",
    "Connected Components",
    "Strongly Connected Components",
    "Triangles",
    "Triangle Count",
    "Balanced Triads"
  ],
  algorithmDefinitions: {
    "Louvain": {
      Form: LouvainForm,
      service: louvain,
      ResultView: CommunityResult,
      parameters: {
        direction: 'Outgoing',
        persist: false,
        writeProperty: "louvain",
        defaultValue: 1
      },
      description: `one of the fastest modularity-based algorithms and also reveals a hierarchy of communities at
        different scales`
    },
    "Label Propagation": {
      Form: LabelPropagationForm,
      service: lpa,
      ResultView: CommunityResult,
      parameters: {
        direction: 'Outgoing',
        persist: false,
        writeProperty: "lpa",
        defaultValue: 1
      },
      description: "a fast algorithm for finding communities in a graph"
    },
    "Connected Components": {
      Form: ConnectedComponentsForm,
      service: connectedComponents,
      ResultView: CommunityResult,
      parameters: {},
      description: "finds sets of connected nodes in an undirected graph where each node is reachable from any other node in the same set"
    },
    "Strongly Connected Components": {
      Form: StronglyConnectedComponentsForm,
      service: stronglyConnectedComponents,
      ResultView: CommunityResult,
      parameters: {},
      description: "finds sets of connected nodes in a directed graph where each node is reachable in both directions from any other node in the same set"
    },
    "Triangles": {
      Form: TrianglesForm,
      service: triangles,
      ResultView: TrianglesResult,
      parameters: {},
      description: "finds set of three nodes, where each node has a relationship to all other nodes"
    },
    "Triangle Count": {
      Form: TriangleCountForm,
      service: triangleCount,
      ResultView: TriangleCountResult,
      parameters: {},
      description: "finds set of three nodes, where each node has a relationship to all other nodes"
    },
    "Balanced Triads": {
      Form: BalancedTriadsForm,
      service: balancedTriads,
      ResultView: BalancedTriadsResult,
      parameters: {},
      description: "used to evaluate structural balance of the graph"
    }
  }
}