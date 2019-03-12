import React, { Component } from 'react'

export const renderParams = (parameters) => {
  return Object.keys(parameters).map(key =>
    <pre key={key}>:param {key} =>
      {parameters[key]
        ? (typeof parameters[key] === 'string'
          ? ` '${parameters[key]}'`
          : (typeof parameters[key] === "object" ? JSON.stringify(parameters[key], null, 2) : ` ${parameters[key]}`))
        : ' null'};
      </pre>
  )
}
