import React from 'react'
import {Dropdown, Form, Input} from "semantic-ui-react"
import {ProjectedGraphWithWeights} from "../Form/ProjectedGraph";
import {StoreProperty} from "../Form/StoreProperty";
import {OpenCloseSection} from "../Form/OpenCloseSection";

const AlgoForm = ({
                      children, readOnly, onChange, labelOptions, maxIterations, tolerance, label, relationshipType, relationshipTypeOptions, relationshipOrientationOptions,
                      propertyKeyOptions, weightProperty, writeProperty, seedProperty, defaultValue, direction, persist
                  }) => {
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
        propertyKeyOptions, seedProperty, maxIterations, onChange, tolerance, readOnly
    }

    return (
        <Form style={{marginBottom: '1em'}}>
            <ProjectedGraphWithWeights {...projectedGraphProps} />
            <Parameters {...parameterProps} />
            <StoreProperty persist={persist} onChange={onChange} writeProperty={writeProperty} readOnly={readOnly}>
                {children}
            </StoreProperty>
        </Form>
    )
}

const Parameters = ({propertyKeyOptions, seedProperty, maxIterations, onChange, tolerance, readOnly}) => {
    return <OpenCloseSection title="Algorithm Parameters">
        <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>Iterations</label>}
                    control={Input} type='number' value={maxIterations}
                    onChange={(evt, data) => onChange('maxIterations', data.value)} min={1} max={50} step={1}/>

        <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>Damping Factor</label>}
                    control={Input} type='number' value={tolerance} step={0.001}
                    onChange={(evt, data) => onChange('tolerance', data.value)}/>


        <Form.Field inline className={readOnly ? "disabled" : null}>
            <label style={{'width': '12em'}}>Seed Property</label>
            <Dropdown disabled={readOnly} placeholder='Seed Property' defaultValue={seedProperty} search selection
                      options={propertyKeyOptions} onChange={(evt, data) => onChange("seedProperty", data.value)}/>

        </Form.Field>
    </OpenCloseSection>
}

export default AlgoForm