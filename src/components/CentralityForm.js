import React from 'react'
import {Form, Button, Checkbox} from "semantic-ui-react"

export default () => (
  <Form size='mini' style={{marginBottom: '1em'}}>
    <Form.Field>
      <label>Label</label>
      <input placeholder='Label' />
    </Form.Field>
    <Form.Field>
      <label>Relationship Type</label>
      <input placeholder='Relationship Type' />
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