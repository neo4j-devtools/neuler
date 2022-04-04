import {runAlgorithm} from "../../services/embedding"
import {embeddingParams} from "../../services/queries";
import Result from "./Result";
import Node2VecForm_1Point6 from "./Node2Vec/1.6/Form";
import FastRPForm_1Point4 from "./FastRP/1.4/Form";

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
        algorithmName: "gds.beta.node2vec",
        Form: Node2VecForm_1Point6,
        parametersBuilder: embeddingParams,
        service: runAlgorithm,
        ResultView: Result,
        parameters: {
            ...commonRelWeightParameters, ...{
                writeProperty: "node2Vec",
                embeddingDimension: 10,
                iterations: 1,
                walkLength: 80,
                inOutFactor: 1.0,
                returnFactor: 1.0,
                windowSize: 10
            }
        },
        streamQuery: `CALL gds.beta.node2vec.stream($generatedName, $config)
YIELD nodeId, embedding
RETURN gds.util.asNode(nodeId) AS node, embedding
LIMIT toInteger($limit)`,
        storeQuery: `CALL gds.beta.node2vec.write($generatedName, $config)`,
        getFetchQuery: (label, config) => {
            const escapedLabel = config.nodeProjection && config.nodeProjection !== "*" ? ":`" + config.nodeProjection + "`" : ""
            return `MATCH (node${escapedLabel})
WHERE exists(node.\`${config.writeProperty}\`)
WITH node, node.\`${config.writeProperty}\` AS embedding
WITH node, CASE WHEN apoc.meta.type(embedding) = "float[]" THEN embedding ELSE null END as embedding
RETURN node, embedding
LIMIT toInteger($limit)`
        },
        description: `computes a vector representation of a node based on random walks in the graph`,
    },
    "FastRP": {
        algorithmName: "gds.fastRP",
        Form: FastRPForm_1Point4,
        parametersBuilder: embeddingParams,
        service: runAlgorithm,
        ResultView: Result,
        parameters: {
            ...commonRelWeightParameters, ...{
                writeProperty: "fastrp",
                embeddingDimension: 10,
                normalizationStrength: 0
            }
        },
        streamQuery: `CALL gds.fastRP.stream($generatedName, $config)
YIELD nodeId, embedding
RETURN gds.util.asNode(nodeId) AS node, embedding
LIMIT toInteger($limit)`,
        storeQuery: `CALL gds.fastRP.write($generatedName, $config)`,
        getFetchQuery: (label, config) => {
            const escapedLabel = config.nodeProjection && config.nodeProjection !== "*" ? ":`" + config.nodeProjection + "`" : ""
            return `MATCH (node${escapedLabel})
WHERE exists(node.\`${config.writeProperty}\`)
WITH node, node.\`${config.writeProperty}\` AS embedding
WITH node, CASE WHEN apoc.meta.type(embedding) = "float[]" THEN embedding ELSE null END as embedding
RETURN node, embedding
LIMIT toInteger($limit)`
        },
        description: `an inductive algorithm for computing node embeddings`,
    },
};

export default {
    algorithmList: (gdsVersion) => {
        const version = parseInt(gdsVersion.split(".")[1])
        const algorithms = ["Node2Vec", "FastRP"]
        return algorithms
    },
    algorithmDefinitions: (algorithm, gdsVersion) => {
        const version = parseInt(gdsVersion.split(".")[1])
        return algorithms[algorithm]

    },
}
