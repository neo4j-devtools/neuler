import React, {Component,} from 'react'
import {Dropdown, Form, Label, Input, Segment} from "semantic-ui-react"
import {ProjectedGraphWithNoWeights, ProjectedGraphWithWeights} from "../Form/ProjectedGraph";
import {ResultsStorage} from "../Form/ResultsStorage";

const LouvainForm = ({onChange, labelOptions, label, relationshipType, relationshipTypeOptions, relationshipOrientationOptions, propertyKeyOptions, weightProperty, writeProperty, seedProperty, includeIntermediateCommunities, defaultValue, direction, persist}) => {
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
        onChange
    }

    const parameterProps = {
        propertyKeyOptions, seedProperty, includeIntermediateCommunities, onChange
    }

    return (
        <Form size='mini' style={{marginBottom: '1em'}}>
            <ProjectedGraphWithWeights {...projectedGraphProps} />
            <Parameters {...parameterProps} />
            <ResultsStorage persist={persist} onChange={onChange} writeProperty={writeProperty}/>
        </Form>
    )

}

const Parameters = ({propertyKeyOptions, seedProperty, includeIntermediateCommunities, onChange}) => {
    return <Segment key={propertyKeyOptions}>
        <Label as='a' attached='top left'>
            Algorithm Parameters
        </Label>
        <Form.Field>
            <label >Seed Property</label>
            <Dropdown placeholder='Weight Property' defaultValue={seedProperty} fluid search selection
                      options={propertyKeyOptions} onChange={(evt, data) => onChange("seedProperty", data.value)}/>

        </Form.Field>
        <Form.Field>
            <label >Intermediate Communities?</label>
            <input type='checkbox' checked={includeIntermediateCommunities} onChange={evt => {
                onChange('includeIntermediateCommunities', evt.target.checked)
            }}/>
        </Form.Field>
    </Segment>
}
export default LouvainForm