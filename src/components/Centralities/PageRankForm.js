import React, {Component} from 'react'
import {Form, Checkbox, Radio} from "semantic-ui-react"

export default class extends Component {
  state = {
    advanced: false
  }

  handleChange = (e, { value }) => this.setState({ value })

  render() {
    const { onChange, iterations, direction } = this.props

    return (
      <Form size='mini' style={{ marginBottom: '1em' }}>
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
            onChange={() => onChange('direction','Outgoing')}
          />
          <Form.Radio
            label='In'
            name='radioGroup'
            value='Incoming'
            checked={direction === 'Incoming'}
            onChange={() => onChange('direction','Incoming')}
          />
          <Form.Radio
            label='Both'
            name='radioGroup'
            value='Both'
            checked={direction === 'Both'}
            onChange={() => onChange('direction','Both')}
          />
        </Form.Group>
        <Form.Field>
          <label>Iterations</label>
          <input
            type='range'
            min={1}
            max={50}
            step={1}
            value={iterations}
            onChange={evt => onChange('iterations', evt.target.value)}
            style={{ 'width': '10em' }}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox label='Write results to the database'/>
        </Form.Field>
      </Form>
    )
  }
}

