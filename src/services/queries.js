export const streamQueryOutline = (callAlgorithm) => `${callAlgorithm}
WITH algo.getNodeById(nodeId) AS node, score
RETURN node, score
ORDER BY score DESC
LIMIT $limit
`
