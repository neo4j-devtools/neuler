import React from 'react'
import {Form} from "semantic-ui-react"
import {ProjectedGraphWithWeights} from "../Form/ProjectedGraph";
import {ResultsFilteringWrapper} from "../Form/ResultsFiltering";

const AlgoForm = ({
                      onChange, readOnly, labelOptions, relationshipType, label, propertyKeyOptions,
                      relationshipOrientationOptions, relationshipTypeOptions, weightProperty, defaultValue, direction, children
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

    return (
        <Form size='mini' style={{marginBottom: '1em'}}>
            <ProjectedGraphWithWeights {...projectedGraphProps} />
            <ResultsFilteringWrapper>{children}</ResultsFilteringWrapper>
        </Form>
    )
}

export default AlgoForm