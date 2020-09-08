import React from 'react'
import { Form, Input, Dropdown } from "semantic-ui-react"

export default ({relationshipType, onChange, direction, persist, writeProperty, weightProperty, label, labelOptions, relationshipTypeOptions, relationshipOrientationOptions}) => (
  <React.Fragment>
    <Form.Field>
      <label>Label</label>
      <Dropdown placeholder='Label'  fluid search selection options={labelOptions} onChange={(evt, data) => onChange("label", data.value)} />
    </Form.Field>
    <Form.Field>
      <label>Relationship Type</label>
      <Dropdown placeholder='RelationshipType' fluid search selection options={relationshipTypeOptions} onChange={(evt, data) => onChange("relationshipType", data.value)} />
    </Form.Field>

    {relationshipType ?
    <Form.Field>
      <label>Relationship Orientation</label>
      <Dropdown placeholder='RelationshipOrientation' defaultValue={direction} fluid search selection options={relationshipOrientationOptions} onChange={(evt, data) => onChange("direction", data.value)} />
    </Form.Field> : null }

    <Form.Group inline>
      <Form.Field inline>
        <label style={{ 'width': '8em' }}>Store results</label>
        <input type='checkbox' checked={persist} onChange={evt => {
          onChange('persist', evt.target.checked)
        }}/>
      </Form.Field>
      {
        persist ?
          <Form.Field inline>
            <Input size='mini' basic="true" value={writeProperty} placeholder='Write Property' onChange={evt => onChange('writeProperty', evt.target.value)}/>
          </Form.Field>
          : null
      }
    </Form.Group>

  </React.Fragment>
)
