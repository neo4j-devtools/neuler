import React from 'react'
import {Dropdown, Form, Input} from "semantic-ui-react"

export default ({onChange, direction, persist, writeProperty, weightProperty, writeRelationshipType, similarityCutoff, degreeCutoff, labelOptions, relationshipTypeOptions, propertyKeyOptions}) => (
  <React.Fragment>
    <Form.Field>
      <label>Item Label</label>
      <Dropdown placeholder='Item Label' fluid search selection options={labelOptions}
                onChange={(evt, data) => onChange("itemLabel", data.value)}/>
    </Form.Field>
    <Form.Field>
      <label>Relationship Type</label>
      <Dropdown placeholder='RelationshipType' fluid search selection options={relationshipTypeOptions}
                onChange={(evt, data) => onChange("relationshipType", data.value)}/>
    </Form.Field>

    <Form.Field>
      <label>Weight Property</label>
      <Dropdown placeholder='Weight Property' defaultValue={weightProperty} fluid search selection options={propertyKeyOptions} onChange={(evt, data) => onChange("weightProperty", data.value)} />

    </Form.Field>

    <Form.Field>
      <label>Category Label</label>
      <Dropdown placeholder='Category Label' fluid search selection options={labelOptions}
                onChange={(evt, data) => onChange("categoryLabel", data.value)}/>
    </Form.Field>

    <Form.Group inline>
      <Form.Field inline>
        <label style={{'width': '10em'}}>Store results</label>
        <input type='checkbox' checked={persist} onChange={evt => {
          console.log(evt.target, evt)
          onChange('persist', evt.target.checked)
        }}/>
      </Form.Field>
    </Form.Group>
      {
        persist ?
          <Form.Field>
            <label>Write Property</label>
            <Input  basic="true" value={writeProperty} placeholder='Write Property'
                   onChange={evt => onChange('writeProperty', evt.target.value)}/>
          </Form.Field>
          : null
      }
      {
        persist ?
          <Form.Field>
            <label>Write Relationship Type</label>
            <Input basic="true" value={writeRelationshipType} placeholder='Write Relationship Type'
                   onChange={evt => onChange('writeRelationshipType', evt.target.value)}/>
          </Form.Field>
          : null
      }

    <Form.Field inline>

        <label style={{ 'width': '10em' }}>Similarity Cutoff</label>
        <input
          value={similarityCutoff}
          onChange={evt => onChange('similarityCutoff', evt.target.value)}
          style={{ 'width': '7em' }}
        />
    </Form.Field>
    <Form.Field inline>

      <label style={{ 'width': '10em' }}>Degree Cutoff</label>
      <input
        value={degreeCutoff}
        onChange={evt => onChange('degreeCutoff', evt.target.value)}
        style={{ 'width': '7em' }}
      />
    </Form.Field>

  </React.Fragment>
)
