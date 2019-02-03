import React, {Component} from 'react'
import { Form, Label, Input } from "semantic-ui-react"
import CommunityForm from './CommunityForm'
import StreamOnlyForm from './StreamOnlyForm'

export default class extends Component {
  state = {
    advanced: false
  }

  render() {
    const { onChange, labelOptions, relationshipTypeOptions, weightProperty, defaultValue, concurrency, direction, persist } = this.props

    return (
      <Form size='mini' style={{ marginBottom: '1em' }}>
        <StreamOnlyForm onChange={onChange} direction={direction} persist={persist} concurrency={concurrency} labelOptions={labelOptions} relationshipTypeOptions={relationshipTypeOptions}/>
        <Form.Group inline>
          <Form.Field inline>
            <label style={{ 'width': '8em' }}>Store results</label>
            <input type='checkbox' checked={persist} onChange={evt => {
              console.log(evt.target, evt)
              onChange('persist', evt.target.checked)
            }}/>
          </Form.Field>

          </Form.Group>
          {
            persist ?
            <Form.Group>
            <Form.Field>
              <label>Balanced Property</label>
              <input placeholder='Balanced Property' onChange={evt => onChange('balancedProperty', evt.target.value)}/>
            </Form.Field>

              </Form.Group>
              : null
          }

          {
            persist ?
            <Form.Group>
            <Form.Field>
              <label>Unbalanced Property</label>
              <input placeholder='Unbalanced Property' onChange={evt => onChange('unbalancedProperty', evt.target.value)}/>
            </Form.Field>

              </Form.Group>
              : null
          }

      </Form>
    )
  }
}
