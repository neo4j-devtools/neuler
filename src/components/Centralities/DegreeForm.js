import React, {Component} from 'react'
import {Form, Input} from "semantic-ui-react"
import {ProjectedGraph} from "../Form/ProjectedGraph";
import {ResultsStorage} from "../Form/ResultsStorage";

export default class extends Component {
  state = {
    advanced: false
  }

  render() {
    const { label, relationshipType, labelOptions, relationshipTypeOptions, propertyKeyOptions, relationshipOrientationOptions, onChange, writeProperty, weightProperty, defaultValue, direction, persist } = this.props

    const projectedGraphProps = {label, labelOptions, relationshipType, direction, relationshipTypeOptions, relationshipOrientationOptions, propertyKeyOptions, weightProperty, defaultValue,  onChange}

    return (
        <Form size='mini' style={{marginBottom: '1em'}}>
            <ProjectedGraph {...projectedGraphProps} />
            <ResultsStorage persist={persist} onChange={onChange} writeProperty={writeProperty} />
        </Form>
    )
  }
}

