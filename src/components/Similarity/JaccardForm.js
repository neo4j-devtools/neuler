import React, {Component} from 'react'
import {Form} from "semantic-ui-react"
import SimilarityForm from "./SimilarityForm";

export default class extends Component {
  state = {
    advanced: false
  }

  render() {
    const {onChange, labelOptions, relationshipTypeOptions, writeProperty, writeRelationshipType, similarityCutoff, concurrency, direction, persist} = this.props

    return (
      <Form size='mini' style={{marginBottom: '1em'}}>
        <SimilarityForm onChange={onChange} direction={direction} writeProperty={writeProperty} persist={persist}
                        concurrency={concurrency} labelOptions={labelOptions} writeRelationshipType={writeRelationshipType} similarityCutoff={similarityCutoff}
                        relationshipTypeOptions={relationshipTypeOptions}/>

      </Form>
    )
  }
}
