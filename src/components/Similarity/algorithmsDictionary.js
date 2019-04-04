import React from "react"
import {constructMaps, runAlgorithm,} from "../../services/similarity"
import {getFetchLouvainCypher, similarityParams} from "../../services/queries";
import JaccardForm from "./JaccardForm";
import SimilarityResult from "./SimilarityResult";

const constructStreamingQueryGetter = (callAlgorithm, constructMapsFn) => (item, relationshipType, category) =>
  `${constructMapsFn(item, relationshipType, category)}

${callAlgorithm}

YIELD item1, item2, similarity
RETURN algo.asNode(item1) AS from, algo.asNode(item2) AS to, similarity
ORDER BY similarity DESC
LIMIT $limit`

const constructStoreQueryGetter = (callAlgorithm, constructMapsFn) => (item, relationshipType, category) =>
  `${constructMapsFn(item, relationshipType, category)}

${callAlgorithm}

YIELD nodes, similarityPairs, write, writeRelationshipType, writeProperty, min, max, mean, stdDev, p25, p50, p75, p90, p95, p99, p999, p100
RETURN nodes, similarityPairs, write, writeRelationshipType, writeProperty, min, max, mean, p95`

const constructFetchQuery = (item, writeRelationshipType) => {
  const itemNode1 = item ?  `(from:\`${item}\`)` : `(from)`
  const itemNode2 = item ?  `(to:\`${item}\`)` : `(to)`
  const rel =  `[rel:\`${writeRelationshipType}\`]`

  return `MATCH ${itemNode1}-${rel}-${itemNode2}
RETURN from, to, rel[$config.writeProperty] AS similarity
ORDER BY similarity DESC
LIMIT $limit`
}


export default {
  algorithmList: [
    "Jaccard",
  ],
  algorithmDefinitions: {
    "Jaccard": {
      Form: JaccardForm,
      parametersBuilder: similarityParams,
      service: runAlgorithm,
      ResultView: SimilarityResult,
      parameters: {
        persist: true,
        writeProperty: "score",
        writeRelationshipType: "SIMILAR",
        concurrency: 8,
        similarityCutoff: 0.1,
        degreeCutoff: 0,
        write: true
      },
      streamQuery: constructStreamingQueryGetter("CALL algo.similarity.jaccard.stream(data, $config)", constructMaps),
      storeQuery: constructStoreQueryGetter(`CALL algo.similarity.jaccard(data, $config)`, constructMaps),
      getFetchQuery: constructFetchQuery,
      description: ` measures similarities between sets. It is defined as the size of the intersection divided by the size of the union of two sets.`
    },

  }
}
