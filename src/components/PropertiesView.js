import React from 'react'
import {Grid} from 'semantic-ui-react'
import {hideProperty, resetLabelsProperties} from "../ducks/settings"
import {connect} from 'react-redux'
import NodeLabel from "./NodeLabel";
import {getActiveDatabase} from "../services/stores/neoStore";

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

const PropertiesView = ({ labels, globalLabels, properties, database }) => {
  const [firstLabel] = labels
  const captionProps = globalLabels[database][firstLabel].propertyKeys
  const caption = Object.keys(properties).filter(key => captionProps.includes(key)).map(key => properties[key].toString()).join(", ");

  return <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Grid columns={4} style={{ width: '100%' }}>
      <Grid.Column key={caption} style={{maxWidth: '40em', padding: '0.5em'}}>
        <NodeLabel labels={labels} caption={caption} />
      </Grid.Column>
    </Grid>
  </div>
}

const mapStateToProps = state => ({
  hiddenProperties: state.settings.hiddenProperties,
  globalLabels: state.settings.labels
})

const mapDispatchToProps = dispatch => ({
  hideProp: (labels, key) => dispatch(hideProperty(labels, key)),
  resetLabelsProperties: labels => dispatch(resetLabelsProperties(labels))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertiesView)