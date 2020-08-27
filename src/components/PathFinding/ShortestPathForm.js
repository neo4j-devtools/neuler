import React, {Component} from 'react'
import {Form, Input, Popup} from "semantic-ui-react"
import StreamOnlyForm from "./StreamOnlyForm";

export default class extends Component {
    state = {
        advanced: false
    }

    render() {
        const { onChange, labelOptions, relationshipType, relationshipTypeOptions, relationshipOrientationOptions, startNode, endNode, weightProperty, defaultValue, direction, persist } = this.props

        return (
            <Form size='mini' style={{ marginBottom: '1em' }}>
                <StreamOnlyForm onChange={onChange} relationshipOrientationOptions={relationshipOrientationOptions} relationshipType={relationshipType} direction={direction} persist={persist} labelOptions={labelOptions} relationshipTypeOptions={relationshipTypeOptions}/>
              <Form.Group inline>
                <label style={{ 'width': '8em' }}>Start Node</label>
                <Form.Field inline>
                  <Popup size="tiny" trigger={<Input size='mini' basic="true" value = {startNode} placeholder='Start Node' onChange={evt => onChange('startNode', evt.target.value)}/>} content='Populate this field with the value of any property on any node' />

                </Form.Field>
              </Form.Group>

              <Form.Group inline>
                <label style={{ 'width': '8em' }}>End Node</label>
                <Form.Field inline>
                  <Popup size="tiny" trigger={<Input size='mini' basic="true" value = {endNode} placeholder='End Node' onChange={evt => onChange('endNode', evt.target.value)}/>} content='Populate this field with the value of any property on any node' />
                </Form.Field>
              </Form.Group>

              {relationshipType ?
                <Form.Field inline>
                  <label style={{ 'width': '8em' }}>Weight Property</label>
                  <input
                    placeholder='Weight Property'
                    value={weightProperty}
                    onChange={evt => onChange('weightProperty', evt.target.value)}
                    style={{ 'width': '10em' }}
                  />
                </Form.Field> : null }
              {
                relationshipType && weightProperty ?
                  <Form.Field inline>
                    <label style={{ 'width': '8em' }}>Default weight</label>
                    <input
                      value={defaultValue}
                      onChange={evt => onChange('defaultValue', evt.target.value)}
                      style={{ 'width': '7em' }}
                    />
                  </Form.Field>
                  : null
              }
            </Form>
        )
    }
}
