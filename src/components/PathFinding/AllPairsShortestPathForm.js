import React, {Component} from 'react'
import { Form, Label, Input } from "semantic-ui-react"
import PathFindingForm from './PathFindingForm'
import StreamOnlyForm from "./StreamOnlyForm";

export default class extends Component {
    state = {
        advanced: false
    }

    render() {
        const { onChange, labelOptions, relationshipType, relationshipOrientationOptions, relationshipTypeOptions, startNodeId, endNodeId, weightProperty, defaultValue, propertyKeyLat, propertyKeyLon, concurrency, direction, persist } = this.props

        return (
            <Form size='mini' style={{ marginBottom: '1em' }}>
                <StreamOnlyForm onChange={onChange} relationshipType={relationshipType} relationshipOrientationOptions={relationshipOrientationOptions} direction={direction} persist={persist} concurrency={concurrency} labelOptions={labelOptions} relationshipTypeOptions={relationshipTypeOptions}/>

                {relationshipType ?
                  <Form.Field inline>
                      <label style={{ 'width': '8em' }}>Weight Property</label>
                      <input
                        placeholder='Weight Property'
                        value={weightProperty}
                        onChange={evt => onChange('weightProperty', evt.target.value)}
                        style={{ 'width': '10em' }}
                      />
                  </Form.Field> : null }
                { relationshipType && weightProperty ?
                  <Form.Field inline>
                      <label style={{ 'width': '8em' }}>Default weight</label>
                      <input
                        value={defaultValue}
                        onChange={evt => onChange('defaultValue', evt.target.value)}
                        style={{ 'width': '7em' }}
                      />
                  </Form.Field>
                  : null
                }

            </Form>
        )
    }
}
