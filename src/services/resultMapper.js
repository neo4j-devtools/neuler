import { v1 as neo } from "neo4j-driver"

export const parseProperties = (properties) => {
  return Object.keys(properties).reduce((props, propKey) => {
    let value = properties[propKey]

    if (neo.isInt(value)) {
      props[propKey] = value.toNumber()
    } else if (Array.isArray(value)) {
      props[propKey] = value.map(item => item.toString()).join(', ')
    } else if(neo.isDate(value) || neo.isDateTime(value) || neo.isDuration(value) || neo.isLocalDateTime(value) || neo.isLocalTime(value)) {
      props[propKey] = value.toString()
    } else {
      props[propKey] = value
    }

    return props
  }, {})
}
