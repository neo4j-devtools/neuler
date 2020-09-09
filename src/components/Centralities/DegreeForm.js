import React from 'react'
import {Form} from "semantic-ui-react"
import {ProjectedGraphWithWeights} from "../Form/ProjectedGraph";
import {ResultsStorage} from "../Form/ResultsStorage";

const DegreeForm = (props) => {
    const {label, relationshipType, labelOptions, relationshipTypeOptions, propertyKeyOptions, relationshipOrientationOptions, onChange, writeProperty, weightProperty, defaultValue, direction, persist} = props
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
            <ResultsStorage persist={persist} onChange={onChange} writeProperty={writeProperty}/>
        </Form>
    )
}

export default DegreeForm