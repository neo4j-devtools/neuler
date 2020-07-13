import React, {Component} from 'react'
import {Form} from "semantic-ui-react"
import WeightedSimilarityForm from "./WeightedSimilarityForm";

export default class extends Component {
  state = {
    advanced: false
  }

  render() {
    const {onChange, labelOptions, relationshipTypeOptions, propertyKeyOptions, writeProperty, writeRelationshipType, similarityCutoff, degreeCutoff,  direction, persist} = this.props

    return (
      <Form size='mini' style={{marginBottom: '1em'}}>
        <WeightedSimilarityForm onChange={onChange} direction={direction} writeProperty={writeProperty} persist={persist}
                        labelOptions={labelOptions} writeRelationshipType={writeRelationshipType} similarityCutoff={similarityCutoff}
                        degreeCutoff = {degreeCutoff} propertyKeyOptions={propertyKeyOptions}
                        relationshipTypeOptions={relationshipTypeOptions}/>

      </Form>
    )
  }
}
