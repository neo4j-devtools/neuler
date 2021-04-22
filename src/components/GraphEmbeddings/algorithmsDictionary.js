import {runAlgorithm} from "../../services/embedding"
import {embeddingParams} from "../../services/queries";
import Result from "./Result";
import Node2VecForm_1Point3 from "./Node2Vec/1.3/Form";
import Node2VecForm_1Point4 from "./Node2Vec/1.4/Form";
import FastRPForm_1Point4 from "./FastRP/1.4/Form";
import FastRPForm_1Point3 from "./FastRP/1.3/Form";

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

const node2Vec1_4 = {
    "Node2Vec": {
        algorithmName: "gds.alpha.node2vec",
        Form: Node2VecForm_1Point4,
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
                returnFactor: 1.0
            }
        },
        streamQuery: `CALL gds.alpha.node2vec.stream($config)
YIELD nodeId, embedding
RETURN gds.util.asNode(nodeId) AS node, embedding
LIMIT toInteger($limit)`,
        storeQuery: `CALL gds.alpha.node2vec.write($config)`,
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
};

const node2Vec1_3 = {
    "Node2Vec": {
        algorithmName: "gds.alpha.node2vec",
        Form: Node2VecForm_1Point3,
        parametersBuilder: embeddingParams,
        service: runAlgorithm,
        ResultView: Result,
        parameters: {
            ...commonRelWeightParameters, ...{
                writeProperty: "node2Vec",
                embeddingSize: 10,
                iterations: 1,
                walkLength: 80,
                inOutFactor: 1.0,
                returnFactor: 1.0
            }
        },
        streamQuery: `CALL gds.alpha.node2vec.stream($config)
YIELD nodeId, embedding
RETURN gds.util.asNode(nodeId) AS node, embedding
LIMIT toInteger($limit)`,
        storeQuery: `CALL gds.alpha.node2vec.write($config)`,
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
};

const fastRP1_4 = {
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
        streamQuery: `CALL gds.fastRP.stream($config)
YIELD nodeId, embedding
RETURN gds.util.asNode(nodeId) AS node, embedding
LIMIT toInteger($limit)`,
        storeQuery: `CALL gds.fastRP    .write($config)`,
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

const fastRP1_3 = {
    "FastRP": {
        algorithmName: "gds.alpha.randomProjection",
        Form: FastRPForm_1Point3,
        parametersBuilder: embeddingParams,
        service: runAlgorithm,
        ResultView: Result,
        parameters: {
            ...commonRelWeightParameters, ...{
                writeProperty: "fastrp",
                embeddingSize: 10,
                normalizationStrength: 0,
                maxIterations: 10
            }
        },
        streamQuery: `CALL gds.alpha.randomProjection.stream($config)
YIELD nodeId, embedding
RETURN gds.util.asNode(nodeId) AS node, embedding
LIMIT toInteger($limit)`,
        storeQuery: `CALL gds.alpha.randomProjection.write($config)`,
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
        const algorithms = version >= 4 ? {...node2Vec1_4, ...fastRP1_4} : {...node2Vec1_3, ...fastRP1_3};
        return algorithms[algorithm]

    },
}
