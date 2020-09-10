import React from 'react'
import {Form} from "semantic-ui-react"
import {ProjectedGraphWithNoWeights} from "../Form/ProjectedGraph";
import {StoreProperty} from "../Form/StoreProperty";

const AlgoForm = ({readOnly, relationshipOrientationOptions, onChange, label, labelOptions, relationshipType, relationshipTypeOptions, clusteringCoefficientProperty, direction, persist, children}) => {
    const projectedGraphProps = {
        label,
        labelOptions,
        relationshipType,
        direction,
        relationshipTypeOptions,
        relationshipOrientationOptions,
        onChange,
        readOnly
    }

    return (
        <Form size='mini' style={{marginBottom: '1em'}}>

            <ProjectedGraphWithNoWeights {...projectedGraphProps} />
            <StoreProperty persist={persist} onChange={onChange} writeProperty={clusteringCoefficientProperty} readOnly={readOnly}>
                {children}
            </StoreProperty>
        </Form>
    )
}

export default AlgoForm