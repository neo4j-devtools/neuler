import React from 'react'
import { Form, Input } from "semantic-ui-react"

export default ({onChange, direction, persist, concurrency}) => (
  <React.Fragment>
    <Form.Field>
      <label>Label</label>
      <input placeholder='Label' onChange={evt => onChange('label', evt.target.value)}/>
    </Form.Field>
    <Form.Field>
      <label>Relationship Type</label>
      <input placeholder='Relationship Type' onChange={evt => onChange('relationshipType', evt.target.value)}/>
    </Form.Field>
    <Form.Group inline>
      <label style={{ 'width': '8em' }}>Direction</label>
      <Form.Radio
        label='Out'
        name='radioGroup'
        value='Outgoing'
        checked={direction === 'Outgoing'}
        onChange={() => onChange('direction', 'Outgoing')}
      />
      <Form.Radio
        label='In'
        name='radioGroup'
        value='Incoming'
        checked={direction === 'Incoming'}
        onChange={() => onChange('direction', 'Incoming')}
      />
      <Form.Radio
        label='Both'
        name='radioGroup'
        value='Both'
        checked={direction === 'Both'}
        onChange={() => onChange('direction', 'Both')}
      />
    </Form.Group>
    <Form.Group inline>
      <Form.Field inline>
        <label style={{ 'width': '8em' }}>Store results</label>
        <input type='checkbox' checked={persist} onChange={evt => {
          console.log(evt.target, evt)
          onChange('persist', evt.target.checked)
        }}/>
      </Form.Field>
      {
        persist ?
          <Form.Field inline>
            <Input size='mini' basic="true" placeholder='Write Property' onChange={evt => onChange('writeProperty', evt.target.value)}/>
          </Form.Field>
          : null
      }
    </Form.Group>
    <Form.Field inline>
      <label style={{ 'width': '8em' }}>Concurrency</label>
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
  </React.Fragment>
)