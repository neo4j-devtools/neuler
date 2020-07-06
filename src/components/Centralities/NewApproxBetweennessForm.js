import React from 'react'
import {Form} from "semantic-ui-react"
import CentralityForm from "./CentralityForm"

export default ({ onChange, labelOptions, relationshipTypeOptions, relationshipOrientationOptions, relationshipType, writeProperty, direction, persist, concurrency, maxDepth, strategy, probability, samplingSize }) => (
  <Form size='mini' style={{ marginBottom: '1em' }}>
    <CentralityForm onChange={onChange} relationshipType={relationshipType} direction={direction} persist={persist} concurrency={concurrency} writeProperty={writeProperty} labelOptions={labelOptions} relationshipTypeOptions={relationshipTypeOptions} relationshipOrientationOptions={relationshipOrientationOptions} />
    <Form.Field inline>
      <label style={{ 'width': '8em' }}>Sampling size</label>
      <input
        type='number'
        min={1}
        step={1}
        value={samplingSize}
        onChange={evt => onChange('samplingSize', evt.target.value)}
        style={{ 'width': '8em' }}
      />
    </Form.Field>
  </Form>
)
