import { v1 as neo } from "neo4j-driver"

export const parseProperties = (properties) => {
  return Object.keys(properties).reduce((props, propKey) => {
    console.log(propKey, properties[propKey])
    let value = properties[propKey]

    if (neo.isInt(value)) {
      props[propKey] = value.toNumber()
    } else if (Array.isArray(value)) {
      props[propKey] = value.map(item => item.toString()).join(', ')
    } else {
      props[propKey] = value
    }

    return props
  }, {})
}