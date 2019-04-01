import React, {Component} from 'react'
import { Form, Label, Input } from "semantic-ui-react"
import CommunityForm from './CommunityForm'

export default class extends Component {
  state = {
    advanced: false
  }

  render() {
    const { onChange, labelOptions, relationshipTypeOptions,  weightProperty, writeProperty, communityProperty, includeIntermediateCommunities, intermediateCommunitiesWriteProperty, defaultValue, concurrency, direction, persist } = this.props

    return (
      <Form size='mini' style={{ marginBottom: '1em' }}>
        <CommunityForm onChange={onChange} direction={direction} writeProperty={writeProperty} persist={persist} concurrency={concurrency} labelOptions={labelOptions} relationshipTypeOptions={relationshipTypeOptions}/>
        <Form.Field inline>
          <label style={{ 'width': '10em' }}>Weight Property</label>
          <input
            placeholder='Weight Property'
            value={weightProperty}
            onChange={evt => onChange('weightProperty', evt.target.value)}
            style={{ 'width': '10em' }}
          />
        </Form.Field>
        {
          weightProperty ?
        <Form.Field inline>
          <label style={{ 'width': '10em' }}>Default weight</label>
          <input
            value={defaultValue}
            onChange={evt => onChange('defaultValue', evt.target.value)}
            style={{ 'width': '7em' }}
          />
          </Form.Field> : null
        }

        <Form.Field inline>
          <label style={{ 'width': '10em' }}>Community Property</label>
          <input
            placeholder='Community Property'
            value={communityProperty}
            onChange={evt => onChange('communityProperty', evt.target.value)}
            style={{ 'width': '10em' }}
          />
        </Form.Field>
          <Form.Field inline>
            <label style={{ 'width': '10em' }}>Intermediate Communities?</label>
            <input type='checkbox' checked={includeIntermediateCommunities} onChange={evt => {
              onChange('includeIntermediateCommunities', evt.target.checked)
            }}/>
          </Form.Field>
          { includeIntermediateCommunities ?
          <Form.Field inline>
            <label style={{ 'width': '10em' }}>Intermediate Communities Write Property</label>
            <input
              placeholder='Intermediate Communities Write Property'
              value={intermediateCommunitiesWriteProperty}
              onChange={evt => onChange('* intermediateCommunitiesWriteProperty', evt.target.value)}
              style={{ 'width': '10em' }}
            />
          </Form.Field> : null }
      </Form>
    )
  }
}
