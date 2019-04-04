import React from "react"
import {runAlgorithm,} from "../../services/communityDetection"
import {Card} from "semantic-ui-react/dist/commonjs/views/Card"
import {getFetchLouvainCypher, similarityParams} from "../../services/queries";
import JaccardForm from "./JaccardForm";
import SimilarityResult from "./SimilarityResult";

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
        concurrency: 8
      },
      streamQuery: (item, relationshipType, category) =>  `MATCH (item:\`${item}\`)-[:\`${relationshipType}\`]->(category:\`${category}\`)
WITH {item:id(item), categories: collect(id(category))} as userData
WITH collect(userData) as data
CALL algo.similarity.jaccard.stream(data)
YIELD item1, item2, count1, count2, intersection, similarity
RETURN algo.asNode(item1) AS from, algo.asNode(item2) AS to, intersection, similarity
ORDER BY similarity DESC
LIMIT $limit`,
      storeQuery: `CALL algo.louvain($label, $relationshipType, $config)`,
      getFetchQuery: getFetchLouvainCypher,
      description: `one of the fastest modularity-based algorithms and also reveals a hierarchy of communities at different scales`
    },

  }
}
