import React from 'react'
import { Form, Input, Dropdown } from "semantic-ui-react"

export default ({onChange, direction, persist, concurrency, label, labelOptions, relationshipTypeOptions}) => (
  <React.Fragment>
    <Form.Field>
      <label>Label</label>
      <Dropdown placeholder='Label' fluid search selection options={labelOptions} onChange={(evt, data) => onChange("label", data.value)} />
    </Form.Field>
    <Form.Field>
      <label>Relationship Type</label>
      <Dropdown placeholder='RelationshipType' fluid search selection options={relationshipTypeOptions} onChange={(evt, data) => onChange("relationshipType", data.value)} />
    </Form.Field>
    <Form.Group inline>
      <label style={{ 'width': '8em' }}>Direction</label>
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
    <Form.Group inline>
      <Form.Field inline>
        <label style={{ 'width': '8em' }}>Store results</label>
        <input type='checkbox' checked={persist} onChange={evt => {
          console.log(evt.target, evt)
          onChange('persist', evt.target.checked)
        }}/>
      </Form.Field>
      {
        persist ?
          <Form.Field inline>
            <Input size='mini' basic="true" placeholder='Write Property' onChange={evt => onChange('writeProperty', evt.target.value)}/>
          </Form.Field>
          : null
      }
    </Form.Group>
    <Form.Field inline>
      <label style={{ 'width': '8em' }}>Concurrency</label>
      <input
        type='number'
        placeholder="Concurrency"
        min={1}
        max={1000}
        step={1}
        value={concurrency}
        onChange={evt => onChange('concurrency', evt.target.value)}
        style={{ 'width': '10em' }}
      />
    </Form.Field>
  </React.Fragment>
)
