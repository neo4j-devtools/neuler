import React, {Component} from 'react'
import {Dropdown, Form, Input} from "semantic-ui-react"
import SimilarityForm from "./SimilarityForm";

export default class extends Component {
  state = {
    advanced: false
  }

  render() {
    const {onChange, relationshipType, labelOptions, relationshipOrientationOptions, relationshipTypeOptions, writeProperty, writeRelationshipType, similarityCutoff, degreeCutoff, concurrency, direction, persist} = this.props

    return (
      <Form size='mini' style={{marginBottom: '1em'}}>

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

      </Form>
    )
  }
}
