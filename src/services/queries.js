export const streamQueryOutline = (callAlgorithm) => `${callAlgorithm}
WITH algo.getNodeById(nodeId) AS node, score
RETURN node, score
ORDER BY score DESC
LIMIT $limit
`
export const getFetchCypher = label => `MATCH (node${label ? ':' + label : ''})
WHERE not(node[$config.writeProperty] is null)
RETURN node, node[$config.writeProperty] AS score
ORDER BY score DESC
LIMIT $limit`

export const baseParameters = (label, relationshipType, direction, concurrency, limit) => {
  const allowedDirections = ["Incoming", "Outgoing", "Both"]

  return {
    label: label || null,
    relationshipType: relationshipType || null,
    limit: parseInt(limit) || 50,
    config: {
      concurrency: parseInt(concurrency) || null,
      direction: direction && allowedDirections.includes(direction) ? direction : 'Outgoing'
    }
  }
}

export const filterParameters = (raw, allowed) => {
  return Object.keys(raw)
  .filter(key => allowed.includes(key))
  .reduce((obj, key) => {
    return {
      ...obj,
      [key]: raw[key]
    };
  }, {});
}
