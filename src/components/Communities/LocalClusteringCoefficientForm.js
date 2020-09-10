import React, {Component} from 'react'
import {Form, Dropdown, Input} from "semantic-ui-react"
import {ProjectedGraphWithNoWeights} from "../Form/ProjectedGraph";
import {StoreProperty} from "../Form/StoreProperty";

const AlgoForm = ({readOnly, relationshipOrientationOptions, onChange, label, labelOptions, relationshipType, relationshipTypeOptions, clusteringCoefficientProperty, direction, persist}) => {
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
            <StoreProperty persist={persist} onChange={onChange} writeProperty={clusteringCoefficientProperty} readOnly={readOnly}/>
        </Form>
    )
}

export default AlgoForm