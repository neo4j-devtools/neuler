import React from 'react'
import {Form} from "semantic-ui-react"
import {ProjectedGraphWithWeights} from "../Form/ProjectedGraph";
import {ResultsStorage} from "../Form/ResultsStorage";

const AlgoForm = ({onChange, labelOptions, label, relationshipType, relationshipOrientationOptions, relationshipTypeOptions, propertyKeyOptions, writeProperty, weightProperty, defaultValue, direction, persist}) => {
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
        <Form style={{marginBottom: '1em'}}>
            <ProjectedGraphWithWeights {...projectedGraphProps} />
            <ResultsStorage persist={persist} onChange={onChange} writeProperty={writeProperty}/>
        </Form>
    )

}

export default AlgoForm