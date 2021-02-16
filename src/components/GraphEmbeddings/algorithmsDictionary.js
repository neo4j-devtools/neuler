import {runAlgorithm} from "../../services/embedding"
import {embeddingParams} from "../../services/queries";
import Node2VecResult from "./Node2Vec/Result";
import Node2VecForm from "./Node2Vec/Form";

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
        algorithmName: "gds.alpha.node2vec",
        Form: Node2VecForm,
        parametersBuilder: embeddingParams,
        service: runAlgorithm,
        ResultView: Node2VecResult,
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
WITH node, CASE WHEN apoc.meta.type(embedding) = "double[]" THEN embedding ELSE null END as embedding
RETURN node, embedding
LIMIT toInteger($limit)`
        },
        description: `computes a vector representation of a node based on random walks in the graph`,
    },
};


export default {
    algorithmList: (gdsVersion) => {
        const version = parseInt(gdsVersion.split(".")[1])
        const algorithms = ["Node2Vec",]
        return algorithms
    },
    algorithmDefinitions: (algorithm, gdsVersion) => {
        const version = parseInt(gdsVersion.split(".")[1])
        return algorithms[algorithm]

    },
}
