import React from 'react'
import { Form, Input, Dropdown } from "semantic-ui-react"

export default ({onChange, relationshipType, direction, persist, concurrency, labelOptions, relationshipTypeOptions, relationshipOrientationOptions}) => (
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
    {/*<Form.Field inline>*/}
      {/*<label style={{ 'width': '8em' }}>Concurrency</label>*/}
      {/*<input*/}
        {/*type='number'*/}
        {/*placeholder="Concurrency"*/}
        {/*min={1}*/}
        {/*max={1000}*/}
        {/*step={1}*/}
        {/*value={concurrency}*/}
        {/*onChange={evt => onChange('concurrency', evt.target.value)}*/}
        {/*style={{ 'width': '10em' }}*/}
      {/*/>*/}
    {/*</Form.Field>*/}
  </React.Fragment>
)
