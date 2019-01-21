import React from 'react'
import {Form, Checkbox} from "semantic-ui-react"

export default ({onChange}) => (
  <Form size='mini' style={{marginBottom: '1em'}}>
    <Form.Field>
      <label>Label</label>
      <input placeholder='Label' onChange={evt => onChange('label', evt.target.value)}/>
    </Form.Field>
    <Form.Field>
      <label>Relationship Type</label>
      <input placeholder='Relationship Type' onChange={evt => onChange('relationshipType', evt.target.value)} />
    </Form.Field>
    <Form.Field>
      <label>Iterations</label>
      <input
        type='range'
        min={1}
        max={50}
        step={1}
        value={20}
        style={{ 'width': '10em' }}
      />
    </Form.Field>
    <Form.Field>
      <Checkbox label='Write results to the database' />
    </Form.Field>
  </Form>
)