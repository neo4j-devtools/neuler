import React from 'react'
import stringifyObject from 'stringify-object';
import { v1 as neo } from "neo4j-driver"


export const RenderParams = ({parameters = {}}) => {
  return Object.keys(parameters).map(key =>
    <pre key={key}>:param {key} => (
      {parameters[key]
        ? (typeof parameters[key] === 'string'
          ? `'${parameters[key]}'`
          : (typeof parameters[key] === "object" ? `${stringifyObject(parameters[key], {
            indent: "  ",
            transform: (obj, prop, originalResult) => {
              if(neo.isInt(obj[prop])) {
                return obj[prop].toNumber()
              }
              return originalResult
            }
          })}` : ` ${parameters[key]}`))
        : 'null'});
      </pre>
  )
}
