import React from 'react'
import {Form} from "semantic-ui-react"
import CentralityForm from "./CentralityForm"

export default ({ onChange, labelOptions, relationshipTypeOptions, writeProperty, direction, persist, concurrency, maxDepth, strategy, probability }) => (
  <Form size='mini' style={{ marginBottom: '1em' }}>
    <CentralityForm onChange={onChange} direction={direction} persist={persist} concurrency={concurrency} writeProperty={writeProperty} labelOptions={labelOptions} relationshipTypeOptions={relationshipTypeOptions} />
    <Form.Group inline>
      <label style={{ 'width': '8em' }}>Strategy</label>
      <Form.Radio
        label='Degree'
        name='radioGroupStrategy'
        value='degree'
        checked={strategy === 'degree'}
        onChange={() => onChange('strategy', 'degree')}
      />
      <Form.Radio
        label='Random'
        name='radioGroupStrategy'
        value='random'
        checked={strategy === 'random'}
        onChange={() => onChange('strategy', 'random')}
      />
    </Form.Group>
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
    <Form.Field inline>
      <label style={{ 'width': '8em' }}>Probability</label>
      <input
        value={probability}
        onChange={evt => onChange('probability', evt.target.value)}
        style={{ 'width': '5em' }}
      />
    </Form.Field>
  </Form>
)
