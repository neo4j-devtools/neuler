import React from 'react'
import {Checkbox, Dropdown, Form, Input, Label, Segment} from "semantic-ui-react"
import {ProjectedGraphWithWeights} from "../Form/ProjectedGraph";
import {StoreProperty} from "../Form/StoreProperty";
import {OpenCloseSection} from "../Form/OpenCloseSection";

const LouvainForm = ({readOnly, onChange, labelOptions, label, relationshipType, relationshipTypeOptions, relationshipOrientationOptions,
                         propertyKeyOptions, weightProperty, writeProperty, seedProperty, includeIntermediateCommunities, defaultValue, direction, persist,
                     children}) => {
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
            <StoreProperty persist={persist} onChange={onChange} writeProperty={writeProperty} readOnly={readOnly}>
                {children}
            </StoreProperty>
        </Form>
    )

}

const Parameters = ({propertyKeyOptions, seedProperty, includeIntermediateCommunities, onChange, readOnly}) => {
    return <OpenCloseSection title="Algorithm Parameters">
        <Form.Field inline>
            <label style={{'width': '12em'}}>Seed Property</label>
            <Dropdown disabled={readOnly} placeholder='Seed Property' defaultValue={seedProperty}  search selection
                      options={propertyKeyOptions} onChange={(evt, data) => onChange("seedProperty", data.value)}/>

        </Form.Field>
        <Form.Field inline>
            <label style={{'width': '12em'}}>Intermediate Communities?</label>

            <Checkbox disabled={readOnly} toggle checked={includeIntermediateCommunities} onChange={(evt, data) => {
                onChange('includeIntermediateCommunities', data.checked)
            }}/>

        </Form.Field>
    </OpenCloseSection>
}
export default LouvainForm