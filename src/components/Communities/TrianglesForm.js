import React, {Component} from 'react'
import { Form, Label, Input } from "semantic-ui-react"
import StreamOnlyForm from './StreamOnlyForm'

export default class extends Component {
  state = {
    advanced: false,
    relationshipOrientationOptions: [{ key: "Undirected", value: "Undirected", text: 'Undirected' }]
  }

  render() {
    const { onChange, relationshipType, labelOptions, relationshipTypeOptions, weightProperty, defaultValue, concurrency, direction, persist } = this.props

    return (
      <Form size='mini' style={{ marginBottom: '1em' }}>
        <StreamOnlyForm onChange={onChange} relationshipType={relationshipType} relationshipOrientationOptions={this.state.relationshipOrientationOptions} direction={direction} persist={persist} concurrency={concurrency} labelOptions={labelOptions} relationshipTypeOptions={relationshipTypeOptions}/>
      </Form>
    )
  }
}
