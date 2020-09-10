import React from 'react'
import {Form} from "semantic-ui-react"
import {ProjectedGraphWithWeights} from "../Form/ProjectedGraph";
import {StoreProperty} from "../Form/StoreProperty";

const AlgoForm = ({children, readOnly, onChange, labelOptions, relationshipType, label, relationshipOrientationOptions, relationshipTypeOptions, propertyKeyOptions, writeProperty, weightProperty, defaultValue, direction, persist}) => {
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
    return (
        <Form size='mini' style={{marginBottom: '1em'}}>

            <ProjectedGraphWithWeights {...projectedGraphProps} />
            <StoreProperty persist={persist} onChange={onChange} writeProperty={writeProperty} readOnly={readOnly}>
                {children}
            </StoreProperty>
        </Form>
    )
}

export default AlgoForm
