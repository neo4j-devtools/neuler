import React, {Component} from 'react'
import { Form, Label, Input, Dropdown } from "semantic-ui-react"
import CentralityForm from './CentralityForm'

export default class extends Component {
  state = {
    advanced: false
  }

  render() {
    const { labelOptions, relationshipTypeOptions, onChange, iterations, writeProperty,  weightProperty, defaultValue, concurrency, direction, persist, normalization } = this.props

    const normalizationOptions = [
      { key: "none", value: "none", text: "None" },
      { key: "max", value: "max", text: "Max" },
      { key: "l1norm", value: "l1norm", text: "L1 Norm" },
      { key: "l2norm", value: "l2norm", text: "L2 Norm" }
    ]

    return (
      <Form size='mini' style={{ marginBottom: '1em' }}>
        <CentralityForm onChange={onChange} direction={direction} writeProperty={writeProperty} normalization={normalization} persist={persist} concurrency={concurrency} labelOptions={labelOptions} relationshipTypeOptions={relationshipTypeOptions}/>
        <Form.Group inline>
          <label style={{ 'width': '8em' }}>Normalization</label>
           <Dropdown placeholder='Normalization' fluid selection options={normalizationOptions} onChange={(evt, data) => onChange('normalization', data.value)} />
        </Form.Group>

        <Form.Field inline>
          <label style={{ 'width': '8em' }}>Weight Property</label>
          <input
            placeholder='Weight Property'
            value={weightProperty}
            onChange={evt => onChange('weightProperty', evt.target.value)}
            style={{ 'width': '10em' }}
          />
        </Form.Field>
        <Form.Field inline>
          <label style={{ 'width': '8em' }}>Default weight</label>
          <input
            value={defaultValue}
            onChange={evt => onChange('defaultValue', evt.target.value)}
            style={{ 'width': '7em' }}
          />
          </Form.Field>
        <Form.Field inline>
          <label style={{ 'width': '8em' }}>Iterations</label>
          <input
            type='number'
            min={1}
            max={50}
            step={1}
            value={iterations}
            onChange={evt => onChange('iterations', evt.target.value)}
            style={{ 'width': '5em' }}
          />
        </Form.Field>
      </Form>
    )
  }
}
