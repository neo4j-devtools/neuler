import React, {Component} from 'react'
import { Form } from "semantic-ui-react"
import CentralityForm from './CentralityForm'

export default class extends Component {
  state = {
    advanced: false
  }

  render() {
    const { onChange, iterations, direction } = this.props

    return (
      <Form size='mini' style={{ marginBottom: '1em' }}>
        <CentralityForm onChange={onChange} direction={direction}/>
        {/* <Form.Field>
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
        </Form.Field>*/}
      </Form>
    )
  }
}

