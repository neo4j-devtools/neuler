import React, {Component} from 'react'
import { Form, Label, Input } from "semantic-ui-react"
import CommunityForm from './CommunityForm'

export default class extends Component {
  state = {
    advanced: false
  }

  render() {
    const { onChange, relationshipType, relationshipOrientationOptions, labelOptions, relationshipTypeOptions, writeProperty, weightProperty, defaultValue, concurrency, direction, persist } = this.props

    return (
      <Form size='mini' style={{ marginBottom: '1em' }}>
        <CommunityForm relationshipOrientationOptions={relationshipOrientationOptions} relationshipType={relationshipType} onChange={onChange} direction={direction} persist={persist} writeProperty={writeProperty} concurrency={concurrency} labelOptions={labelOptions} relationshipTypeOptions={relationshipTypeOptions}/>
      </Form>
    )
  }
}
