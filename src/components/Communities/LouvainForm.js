import React from 'react'
import {Checkbox, Dropdown, Form, Label, Segment} from "semantic-ui-react"
import {ProjectedGraphWithWeights} from "../Form/ProjectedGraph";
import {StoreProperty} from "../Form/StoreProperty";

const LouvainForm = ({readOnly, onChange, labelOptions, label, relationshipType, relationshipTypeOptions, relationshipOrientationOptions, propertyKeyOptions, weightProperty, writeProperty, seedProperty, includeIntermediateCommunities, defaultValue, direction, persist}) => {
    const projectedGraphProps = {
        label,
        labelOptions,
        relationshipType,
        direction,
        relationshipTypeOptions,
        relationshipOrientationOptions,
        propertyKeyOptions,
        weightProperty,
        defaultValue,
        onChange,
        readOnly
    }

    const parameterProps = {
        propertyKeyOptions, seedProperty, includeIntermediateCommunities, onChange, readOnly
    }

    return (
        <Form size='mini' style={{marginBottom: '1em'}}>
            <ProjectedGraphWithWeights {...projectedGraphProps} />
            <Parameters {...parameterProps} />
            <StoreProperty persist={persist} onChange={onChange} writeProperty={writeProperty} readOnly={readOnly}/>
        </Form>
    )

}

const Parameters = ({propertyKeyOptions, seedProperty, includeIntermediateCommunities, onChange, readOnly}) => {
    return <Segment key={propertyKeyOptions}>
        <Label as='a' attached='top left'>
            Algorithm Parameters
        </Label>
        <Form.Field inline>
            <label style={{'width': '12em'}}>Seed Property</label>
            <Dropdown disabled={readOnly} placeholder='Weight Property' defaultValue={seedProperty} fluid search selection
                      options={propertyKeyOptions} onChange={(evt, data) => onChange("seedProperty", data.value)}/>

        </Form.Field>
        <Form.Field inline>
            <label style={{'width': '12em'}}>Intermediate Communities?</label>

            <Checkbox disabled={readOnly} toggle checked={includeIntermediateCommunities} onChange={(evt, data) => {
                onChange('includeIntermediateCommunities', data.checked)
            }}/>

        </Form.Field>
    </Segment>
}
export default LouvainForm