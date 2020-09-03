import React, {Component} from 'react'
import {Form, Grid, Icon, Label} from 'semantic-ui-react'
import {hideProperty, resetLabelsProperties} from "../ducks/settings"
import {connect} from 'react-redux'

const cellStyle = {
  maxWidth: '20em',
  overflow: 'hidden'
}

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

export const generateCellStyle = (labels) => {
  let style = {
    maxWidth: '40em',
    overflow: 'hidden',
    cursor: "pointer"
  };

  const labelBackgrounds = {
    "Character": "#FBF3FB",
    "Place": "#E0BBE4",
    "User": "#FFDFD3",
    "Recipe": "#A4C3D2",
    "Ingredient": "#ECC3EB"
  };

  let [label] = labels;
  style.background = labelBackgrounds[label] || "#efefef"
  return style;
}

const PropertiesView = ({ labels, properties, hideProp, resetLabelsProperties, hiddenProperties = {} }) => {
  const hiddenProps = extractHiddenProperties(labels, hiddenProperties)
  const caption = Object.keys(properties).filter(key => !hiddenProps.includes(key)).map(key => properties[key].toString()).join(", ");

  return <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Grid columns={4} style={{ width: '100%' }}>
      <Grid.Column key={caption} style={{ maxWidth: '40em', padding: '0.5em' }}>
                <span style={generateCellStyle(labels)} className="label-results">{caption}</span>
              </Grid.Column>
    </Grid>
  </div>

  // const resetButton = hiddenProps.length > 0
  //   ? <Grid.Column key='reset'>
  //     <Form>
  //       <Form.Field>
  //         <Icon name='undo' color='green' onClick={() => resetLabelsProperties(labels)} style={{ cursor: 'pointer' }}/>
  //       </Form.Field>
  //     </Form>
  //   </Grid.Column>
  //   : null
  //
  // return <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  //   <Grid columns={4} style={{ width: '100%' }}>
  //     {Object.keys(properties)
  //       .filter(key => !hiddenProps.includes(key))
  //       .map(key =>
  //         <Grid.Column key={key} style={{ maxWidth: '20em', padding: '0.5em' }}>
  //           <PropertyCell propertyKey={key} value={properties[key].toString()} hideProp={key => hideProp(labels, key)}
  //                         labels={labels}/>
  //         </Grid.Column>
  //       )
  //     }
  //   </Grid>
  //   {resetButton}
  // </div>
}

class PropertyCell extends Component {
  state = {
    status: "idle"
  }

  onMouseOver() {
    this.setState({
      status: "hovered"
    })
  }

  onMouseLeave() {
    this.setState({
      status: "idle"
    })
  }

  render() {
    const { propertyKey, value } = this.props
    const { status } = this.state

    return (<Form>
      <Form.Field onMouseOver={this.onMouseOver.bind(this)} onMouseLeave={this.onMouseLeave.bind(this)}>
        <label style={{ maxWidth: '20em' }}>{propertyKey}
          {status === "idle" ? null :
            <Icon style={{ cursor: 'pointer' }} color='red' onClick={() => this.props.hideProp(propertyKey)}
                  name="minus circle"/>}
        </label>
        <Label style={cellStyle} basic>{value}</Label>

      </Form.Field>
    </Form>)
  }
}

const mapStateToProps = state => ({
  hiddenProperties: state.settings.hiddenProperties
})

const mapDispatchToProps = dispatch => ({
  hideProp: (labels, key) => dispatch(hideProperty(labels, key)),
  resetLabelsProperties: labels => dispatch(resetLabelsProperties(labels))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertiesView)