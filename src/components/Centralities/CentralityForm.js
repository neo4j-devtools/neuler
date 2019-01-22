import React from 'react'
import { Form } from "semantic-ui-react"

export default ({onChange, direction}) => (
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
      <label>Direction</label>
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
  </React.Fragment>
)