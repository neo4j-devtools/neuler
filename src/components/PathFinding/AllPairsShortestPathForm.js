import React from 'react'
import {Form} from "semantic-ui-react"
import {ProjectedGraphWithWeights} from "../Form/ProjectedGraph";

const AlgoForm = ({onChange, labelOptions, relationshipType, label, propertyKeyOptions, relationshipOrientationOptions, relationshipTypeOptions, weightProperty, defaultValue, direction, persist}) => {
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

        </Form>
    )
}

export default AlgoForm