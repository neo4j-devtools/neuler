import React, {Component} from 'react'
import { Form, Label, Input } from "semantic-ui-react"
import CentralityForm from './CentralityForm'

export default class extends Component {
  state = {
    advanced: false
  }

  render() {
    const { labelOptions, onChange, iterations, dampingFactor, weightProperty, defaultValue, concurrency, direction, persist } = this.props

    return (
      <Form size='mini' style={{ marginBottom: '1em' }}>
        <CentralityForm onChange={onChange} direction={direction} persist={persist} concurrency={concurrency} labelOptions={labelOptions}/>
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
        <Form.Field inline>
          <label style={{ 'width': '8em' }}>Damping Factor</label>
          <input
            value={dampingFactor}
            onChange={evt => onChange('dampingFactor', evt.target.value)}
            style={{ 'width': '5em' }}
          />
        </Form.Field>
      </Form>
    )
  }
}
