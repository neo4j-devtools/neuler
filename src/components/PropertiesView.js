import React, { Component } from 'react'
import { Form, Grid, Label, Icon } from 'semantic-ui-react'
import { hideProperty } from "../ducks/settings"
import { connect } from 'react-redux'

const cellStyle = {
  maxWidth: '20em',
  overflow: 'hidden'
}

const extractHiddenProperties = (labels, hiddenPropertiesMap) => {
  const hiddenProps = Object.keys(hiddenPropertiesMap).reduce((hiddenProperties, label) => {
    if (labels.includes(label)) {
      hiddenPropertiesMap[label].forEach(propertyKey => hiddenProperties.add(propertyKey))
    }
    return hiddenProperties
  }, new Set())
  return Array.from(hiddenProps)
}

const PropertiesView = ({ labels, properties, hideProp, hiddenProperties = {} }) => <Grid columns={2}>
  {Object.keys(properties)
    .filter(key => !extractHiddenProperties(labels, hiddenProperties).includes(key))
    .map(key =>
      <Grid.Column key={key} style={{ maxWidth: '20em' }}>
        <PropertyCell propertyKey={key} value={properties[key]} hideProp={key => hideProp(labels, key)}
                      labels={labels}/>
      </Grid.Column>
    )
  }
</Grid>

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
          {status === "idle" ? null : <Icon style={{cursor: 'pointer'}} color='red' onClick={() => this.props.hideProp(propertyKey)} name="minus circle"/>}
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
  hideProp: (labels, key) => dispatch(hideProperty(labels, key))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertiesView)