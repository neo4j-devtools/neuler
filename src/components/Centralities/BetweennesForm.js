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
    <Form.Group inline>
      <label>Direction</label>
      <Form.Radio
        label='Out'
        value='sm'
        checked={true}
      />
      <Form.Radio
        label='In'
        value='sm'
      />
      <Form.Radio
        label='Both'
        value='sm'
      />
    </Form.Group>
    <Form.Field>
      <Checkbox label='Write results to the database' />
    </Form.Field>
  </Form>
)