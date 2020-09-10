import React from 'react'
import {Form} from "semantic-ui-react"
import {ProjectedGraphWithWeights} from "../Form/ProjectedGraph";
import {StoreProperty} from "../Form/StoreProperty";

const DegreeForm = (props) => {
    const {readOnly, label, relationshipType, labelOptions, relationshipTypeOptions, propertyKeyOptions, relationshipOrientationOptions, onChange, writeProperty, weightProperty, defaultValue, direction, persist, children} = props
    const projectedGraphProps = {
        readOnly,
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

    return (
        <Form size='mini' style={{marginBottom: '1em'}}>
            <ProjectedGraphWithWeights {...projectedGraphProps} />
            <StoreProperty persist={persist} onChange={onChange} writeProperty={writeProperty} readOnly={readOnly}>
                {children}
            </StoreProperty>
        </Form>
    )
}

export default DegreeForm