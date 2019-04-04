import React, {Component} from 'react'
import { Form, Label, Input } from "semantic-ui-react"
import PathFindingForm from './PathFindingForm'
import StreamOnlyForm from "./StreamOnlyForm";

export default class extends Component {
    state = {
        advanced: false
    }

    render() {
        const { onChange, labelOptions, relationshipTypeOptions, startNodeId, endNodeId, startNode, endNode, weightProperty, defaultValue, propertyKeyLat, propertyKeyLon, concurrency, direction, persist } = this.props

        return (
            <Form size='mini' style={{ marginBottom: '1em' }}>
                <Form.Group inline>
                    <label style={{ 'width': '8em' }}>Start Node</label>
                    <Form.Field inline>
                        <Input size='mini' basic="true" value = {startNode} placeholder='Start Node' onChange={evt => onChange('startNode', evt.target.value)}/>
                    </Form.Field>
                </Form.Group>
                <Form.Group inline>
                    <label style={{ 'width': '8em' }}>End Node</label>
                    <Form.Field inline>
                        <Input size='mini' basic="true" value = {endNode} placeholder='End Node' onChange={evt => onChange('endNode', evt.target.value)}/>
                    </Form.Field>
                </Form.Group>
                <Form.Field inline>
                    <label style={{ 'width': '8em' }}>Weight Property</label>
                    <input size='mini'
                        placeholder='Weight Property'
                        value={weightProperty}
                        onChange={evt => onChange('weightProperty', evt.target.value)}

                    />
                </Form.Field>

                <Form.Field inline>
                    <label style={{ 'width': '8em' }}>Property Key Lat</label>
                    <input
                        value={propertyKeyLat}
                        onChange={evt => onChange('propertyKeyLat', evt.target.value)}
                        style={{ 'width': '7em' }}
                    />
                </Form.Field>
                <Form.Field inline>
                    <label style={{ 'width': '8em' }}>Property Key Lon</label>
                    <input size='mini'
                           value={propertyKeyLon}
                           onChange={evt => onChange('propertyKeyLon', evt.target.value)}

                    />
                </Form.Field>
                <Form.Field inline>
                    <label style={{ 'width': '8em' }}>Weight Property</label>
                    <input size='mini'
                           placeholder='Weight Property'
                           value={weightProperty}
                           onChange={evt => onChange('weightProperty', evt.target.value)}

                    />
                </Form.Field>
                <StreamOnlyForm onChange={onChange} direction={direction} persist={persist} concurrency={concurrency} labelOptions={labelOptions} relationshipTypeOptions={relationshipTypeOptions}/>
            </Form>
        )
    }
}
