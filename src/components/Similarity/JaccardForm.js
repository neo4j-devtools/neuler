import React from 'react'
import {Form} from "semantic-ui-react"
import {ProjectedGraphWithNoWeights} from "../Form/ProjectedGraph";
import {StorePropertyAndRelationshipType} from "../Form/StorePropertyAndRelationshipType";
import {Parameters} from "./Parameters";

const AlgoForm = ({onChange, readOnly, relationshipType, label, propertyKeyOptions, labelOptions, relationshipOrientationOptions, relationshipTypeOptions, writeProperty, writeRelationshipType, similarityCutoff, degreeCutoff, direction, persist}) => {
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
            <Parameters onChange={onChange} similarityCutoff={similarityCutoff} degreeCutoff={degreeCutoff} readOnly={readOnly} />
            <StorePropertyAndRelationshipType persist={persist} onChange={onChange}
                                              writeProperty={writeProperty}
                                              writeRelationshipType={writeRelationshipType} readOnly={readOnly}
            />
        </Form>
    )
}

export default AlgoForm