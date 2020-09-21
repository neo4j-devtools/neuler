import {constructSimilarityMaps, constructWeightedSimilarityMaps, runAlgorithm,} from "../../services/similarity"
import {nodeSimilarityParams, similarityParams} from "../../services/queries";
import JaccardForm from "./JaccardForm";
import SimilarityResult from "./SimilarityResult";
import CosineForm from "./CosineForm";
import PearsonForm from "./PearsonForm";
import OverlapForm from "./OverlapForm";
import EuclideanForm from "./EuclideanForm";

const constructStreamingQueryGetter = (callAlgorithm, constructMapsFn) => (item, relationshipType, category, weightProperty) =>
  `${constructMapsFn(item, relationshipType, category, weightProperty)}
WITH $config AS config, data
WITH config { .*, data: data} as config

${callAlgorithm}

YIELD item1, item2, similarity
RETURN gds.util.asNode(item1) AS from, gds.util.asNode(item2) AS to, similarity
ORDER BY similarity DESC
LIMIT toInteger($limit)`

const constructStoreQueryGetter = (callAlgorithm, constructMapsFn) => (item, relationshipType, category, weightProperty) =>
  `${constructMapsFn(item, relationshipType, category, weightProperty)}
WITH $config AS config, data
WITH config { .*, data: data} as config

${callAlgorithm}

YIELD nodes, similarityPairs, writeRelationshipType, writeProperty, min, max, mean, stdDev, p25, p50, p75, p90, p95, p99, p999, p100
RETURN nodes, similarityPairs, writeRelationshipType, writeProperty, min, max, mean, p95`

const constructFetchQuery = (item, writeRelationshipType, config) => {
  const itemNode1 = item && item !== "*" ?  `(from:\`${item}\`)` : `(from)`
  const itemNode2 = item && item !== "*" ?  `(to:\`${item}\`)` : `(to)`
  const rel =  `[rel:\`${writeRelationshipType}\`]`

  return `MATCH ${itemNode1}-${rel}-${itemNode2}
WHERE exists(rel.\`${config.writeProperty}\`)
RETURN from, to, rel.\`${config.writeProperty}\` AS similarity
ORDER BY similarity DESC
LIMIT toInteger($limit)`
}


const algorithms = {
  "Jaccard": {
    algorithmName: "gds.nodeSimilarity",
    Form: JaccardForm,
    parametersBuilder: nodeSimilarityParams,
    service: runAlgorithm,
    ResultView: SimilarityResult,
    parameters: {
      label: "*",
      relationshipType: "*",
      persist: false,
      writeProperty: "score",
      writeRelationshipType: "SIMILAR_JACCARD",
      similarityCutoff: 0.1,
      degreeCutoff: 1,
      direction: "Natural"
    },
    streamQuery: (item, relationshipType, category) => `CALL gds.nodeSimilarity.stream($config) YIELD node1, node2, similarity
RETURN gds.util.asNode(node1) AS from, gds.util.asNode(node2) AS to, similarity
ORDER BY similarity DESC
LIMIT toInteger($limit)`,
    storeQuery: (item, relationshipType, category) => `CALL gds.nodeSimilarity.write($config)`,
    getFetchQuery: constructFetchQuery,
    description: `measures similarities between sets. It is defined as the size of the intersection divided by the size of the union of two sets.`
  },
  "Overlap": {
    algorithmName: "gds.alpha.similarity",
    Form: OverlapForm,
    parametersBuilder: similarityParams,
    service: runAlgorithm,
    ResultView: SimilarityResult,
    parameters: {
      itemLabel: "*",
      relationshipType: "*",
      categoryLabel: "*",
      persist: false,
      writeProperty: "score",
      writeRelationshipType: "SIMILAR_OVERLAP",
      similarityCutoff: 0.1,
      degreeCutoff: 0,
      write: true
    },
    streamQuery: constructStreamingQueryGetter("CALL gds.alpha.similarity.overlap.stream(config)", constructSimilarityMaps),
    storeQuery: constructStoreQueryGetter(`CALL gds.alpha.similarity.overlap.write(config)`, constructSimilarityMaps),
    getFetchQuery: constructFetchQuery,
    description: `measures overlap between two sets. It is defined as the size of the intersection of two sets, divided by the size of the smaller of the two sets.`
  },

  "Cosine": {
    algorithmName: "gds.alpha.similarity.cosine",
    Form: CosineForm,
    parametersBuilder: similarityParams,
    service: runAlgorithm,
    ResultView: SimilarityResult,
    parameters: {
      itemLabel: "*",
      relationshipType: "*",
      categoryLabel: "*",
      persist: false,
      writeProperty: "score",
      writeRelationshipType: "SIMILAR_COSINE",
      similarityCutoff: 0.1,
      degreeCutoff: 0,
      write: true,
      weightProperty: "weight"
    },
    streamQuery: constructStreamingQueryGetter("CALL gds.alpha.similarity.cosine.stream(config)", constructWeightedSimilarityMaps),
    storeQuery: constructStoreQueryGetter(`CALL gds.alpha.similarity.cosine.write(config)`, constructWeightedSimilarityMaps),
    getFetchQuery: constructFetchQuery,
    description: ` the cosine of the angle between two n-dimensional vectors in an n-dimensional space. It is the dot product of the two vectors divided by the product of the two vectors' lengths (or magnitudes).`
  },

  "Pearson": {
    algorithmName: "gds.alpha.similarity.pearson",
    Form: PearsonForm,
    parametersBuilder: similarityParams,
    service: runAlgorithm,
    ResultView: SimilarityResult,
    parameters: {
      itemLabel: "*",
      relationshipType: "*",
      categoryLabel: "*",
      persist: false,
      writeProperty: "score",
      writeRelationshipType: "SIMILAR_PEARSON",
      similarityCutoff: 0.1,
      degreeCutoff: 0,
      write: true,
      weightProperty: "weight"
    },
    streamQuery: constructStreamingQueryGetter("CALL gds.alpha.similarity.pearson.stream(config)", constructWeightedSimilarityMaps),
    storeQuery: constructStoreQueryGetter(`CALL gds.alpha.similarity.pearson.write(config)`, constructWeightedSimilarityMaps),
    getFetchQuery: constructFetchQuery,
    description: `the covariance of the two n-dimensional vectors divided by the product of their standard deviations.`
  },

  "Euclidean": {
    algorithmName: "gds.alpha.similarity.euclidean",
    Form: EuclideanForm,
    parametersBuilder: similarityParams,
    service: runAlgorithm,
    ResultView: SimilarityResult,
    parameters: {
      itemLabel: "*",
      relationshipType: "*",
      categoryLabel: "*",
      persist: false,
      writeProperty: "score",
      writeRelationshipType: "SIMILAR_EUCLIDEAN",
      similarityCutoff: 0.1,
      degreeCutoff: 0,
      write: true,
      weightProperty: "weight"
    },
    streamQuery: constructStreamingQueryGetter("CALL gds.alpha.similarity.euclidean.stream(config)", constructWeightedSimilarityMaps),
    storeQuery: constructStoreQueryGetter(`CALL gds.alpha.similarity.euclidean.write(config)`, constructWeightedSimilarityMaps),
    getFetchQuery: constructFetchQuery,
    description: `measures the straight line distance between two points in n-dimensional space.`
  },

};
export default {
  algorithmList: [
    "Jaccard",
    "Overlap",
    "Cosine",
    "Pearson",
    "Euclidean"

  ],
  algorithmDefinitions: algorithm => algorithms[algorithm],
}
