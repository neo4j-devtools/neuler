import React, {Component} from 'react'
import {Form, Label, Input, Dropdown} from "semantic-ui-react"
import CommunityForm from './CommunityForm'

export default class extends Component {
  state = {
    advanced: false
  }

  render() {
    const { onChange, labelOptions, relationshipType, relationshipOrientationOptions, relationshipTypeOptions, writeProperty, weightProperty, defaultValue, concurrency, direction, persist } = this.props

    return (
      <Form size='mini' style={{ marginBottom: '1em' }}>

        <Form.Field>
          <label>Label</label>
          <Dropdown placeholder='Label' fluid search selection options={labelOptions} onChange={(evt, data) => onChange("label", data.value)} />
        </Form.Field>

        <Form.Field>
          <label>Relationship Type</label>
          <Dropdown placeholder='RelationshipType' fluid search selection options={relationshipTypeOptions} onChange={(evt, data) => onChange("relationshipType", data.value)} />
        </Form.Field>

        {relationshipType ?
          <Form.Field>
            <label>Relationship Orientation</label>
            <Dropdown placeholder='RelationshipOrientation' defaultValue={direction} fluid search selection options={relationshipOrientationOptions} onChange={(evt, data) => onChange("direction", data.value)} />
          </Form.Field> : null }

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
          weightProperty ?
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

        <Form.Group inline>
          <Form.Field inline>
            <label style={{ 'width': '10em' }}>Store results</label>
            <input type='checkbox' checked={persist} onChange={evt => {
              console.log(evt.target, evt)
              onChange('persist', evt.target.checked)
            }}/>
          </Form.Field>
          {
            persist ?
              <Form.Field inline>
                <Input size='mini' basic="true" value={writeProperty} placeholder='Write Property' onChange={evt => onChange('writeProperty', evt.target.value)}/>
              </Form.Field>
              : null
          }
        </Form.Group>
        <Form.Field inline>
          <label style={{ 'width': '10em' }}>Concurrency</label>
          <input
            type='number'
            placeholder="Concurrency"
            min={1}
            max={1000}
            step={1}
            value={concurrency}
            onChange={evt => onChange('concurrency', evt.target.value)}
            style={{ 'width': '10em' }}
          />
        </Form.Field>
        
      </Form>
    )
  }
}
