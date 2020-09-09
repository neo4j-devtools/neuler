import React from 'react'
import {Form} from "semantic-ui-react"
import {ProjectedGraphWithWeights} from "../Form/ProjectedGraph";
import {StoreProperty} from "../Form/StoreProperty";

const AlgoForm = ({onChange, labelOptions, relationshipType, label, relationshipOrientationOptions, relationshipTypeOptions, propertyKeyOptions, writeProperty, weightProperty, defaultValue, direction, persist}) => {
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
    return (
        <Form size='mini' style={{marginBottom: '1em'}}>

            <ProjectedGraphWithWeights {...projectedGraphProps} />
            <StoreProperty persist={persist} onChange={onChange} writeProperty={writeProperty}/>


        </Form>
    )
}

export default AlgoForm
