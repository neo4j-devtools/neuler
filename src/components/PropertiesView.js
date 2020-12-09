import React from 'react'
import {hideProperty, resetLabelsProperties} from "../ducks/settings"
import {connect} from 'react-redux'
import NodeLabel from "./NodeLabel";
import NodeLabelWithSimilarity from "./NodeLabelWithSimilarity";

export const extractHiddenProperties = (labels, hiddenPropertiesMap) => {
  const keys = Object.keys(hiddenPropertiesMap);
  const hiddenProps = keys.reduce((hiddenProperties, label) => {
    if (labels.includes(label)) {
      hiddenPropertiesMap[label].forEach(propertyKey => hiddenProperties.add(propertyKey))
    }
    return hiddenProperties
  }, new Set());

  (hiddenPropertiesMap['_ALL_NEULER_'] || []).forEach(prop => hiddenProps.add(prop))

  return Array.from(hiddenProps)
}

const PropertiesView = ({labels, globalLabels, properties, database, similarity}) => {
  const [firstLabel] = labels
  if (firstLabel) {
    const captionProps = globalLabels[database][firstLabel].propertyKeys
    const caption = Object.keys(properties).filter(key => captionProps.includes(key)).map(key => properties[key].toString()).join(", ");

    if(similarity) {
      return <NodeLabelWithSimilarity labels={labels} caption={caption} database={database} similarity={similarity} />
    } else {
      return <NodeLabel labels={labels} caption={caption} database={database} readOnly={true}/>
    }
  } else {
    return null
  }
}

const mapStateToProps = state => ({
  hiddenProperties: state.settings.hiddenProperties,
  globalLabels: state.metadata.allLabels
})

const mapDispatchToProps = dispatch => ({
  hideProp: (labels, key) => dispatch(hideProperty(labels, key)),
  resetLabelsProperties: labels => dispatch(resetLabelsProperties(labels))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertiesView)
