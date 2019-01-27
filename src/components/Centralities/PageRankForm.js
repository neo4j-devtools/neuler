import React, {Component} from 'react'
import { Form, Label, Input } from "semantic-ui-react"
import CentralityForm from './CentralityForm'

export default class extends Component {
  state = {
    advanced: false
  }

  render() {
    const { onChange, iterations, dampingFactor,  direction, persist } = this.props

    return (
      <Form size='mini' style={{ marginBottom: '1em' }}>
        <CentralityForm onChange={onChange} direction={direction} persist={persist}/>

        <Form.Field inline>
          <label>Iterations</label>
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
          <label>Damping Factor</label>
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
