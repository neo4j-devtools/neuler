import { isInt, isDate, isDateTime, isLocalDateTime, isLocalTime, isDuration } from "neo4j-driver"

export const parseProperties = (properties) => {
  return Object.keys(properties).reduce((props, propKey) => {
    let value = properties[propKey]

    if (isInt(value)) {
      props[propKey] = value.toNumber()
    } else if (Array.isArray(value)) {
      props[propKey] = value.map(item => item.toString()).join(', ')
    } else if(isDate(value) || isDateTime(value) || isDuration(value) || isLocalDateTime(value) || isLocalTime(value)) {
      props[propKey] = value.toString()
    } else {
      props[propKey] = value
    }

    return props
  }, {})
}
