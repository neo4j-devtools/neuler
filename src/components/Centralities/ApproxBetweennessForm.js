import React from 'react'
import {Form, Button, Checkbox} from "semantic-ui-react"
import CentralityForm from "./CentralityForm"

export default ({ onChange, direction, persist, concurrency, maxDepth }) => (
  <Form size='mini' style={{ marginBottom: '1em' }}>
    <CentralityForm onChange={onChange} direction={direction} persist={persist} concurrency={concurrency}/>
    <Form.Field inline>
      <label style={{ 'width': '8em' }}>Max Depth</label>
      <input
        type='number'
        min={1}
        max={50}
        step={1}
        value={maxDepth}
        onChange={evt => onChange('maxDepth', evt.target.value)}
        style={{ 'width': '5em' }}
      />
    </Form.Field>
  </Form>
)
