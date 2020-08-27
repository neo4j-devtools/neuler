import React from 'react'
import {Dropdown, Form} from "semantic-ui-react"

export default ({onChange, relationshipType, direction, persist, labelOptions, relationshipTypeOptions, relationshipOrientationOptions}) => (
  <React.Fragment>
  <Form.Field>
    <label>Label</label>
    <Dropdown placeholder='Label' fluid search selection options={labelOptions} onChange={(evt, data) => onChange("label", data.value)} />
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

  </React.Fragment>
)
