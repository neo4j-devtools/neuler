import React from 'react'
import stringifyObject from 'stringify-object';
import {isInt} from "neo4j-driver"
import Clipboard from 'react-clipboard.js';
import {Popup} from "semantic-ui-react";

class RenderParams extends React.Component {
  extractValue(parameters, key) {
    return parameters[key]
      ? (typeof parameters[key] === 'string'
        ? `'${parameters[key]}'`
        : (typeof parameters[key] === "object" ? `${stringifyObject(parameters[key], {
          indent: "  ",
          transform: (obj, prop, originalResult) => {
            if (isInt(obj[prop])) {
              return obj[prop].toNumber()
            }
            return originalResult
          }
        })}` : ` ${parameters[key]}`))
      : 'null';
  }

  getText() {
    const {parameters} = this.props

    return Object.keys(parameters)
      .map(key => `:param ${key} => (${this.extractValue(parameters, key)})`)
      .join(";\n")

  }

  render() {
    const {parameters} = this.props
    return <React.Fragment>
      {Object.keys(parameters).map(key =>
          <pre key={key}>:param {key} => ({this.extractValue(parameters, key)});
      </pre>
      )}

      <Clipboard onSuccess={(event) => {
        event.trigger.textContent = "Copied";
        setTimeout(function () {
          event.trigger.textContent = 'Copy';
        }, 2000);
      }}
                 button-className="code"
                 option-text={this.getText.bind(this)}>
        Copy
      </Clipboard>


    </React.Fragment>
  }
}

export default RenderParams
