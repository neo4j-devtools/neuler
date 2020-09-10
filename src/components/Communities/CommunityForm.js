import React from 'react'
import {ProjectedGraphWithNoWeights} from "../Form/ProjectedGraph";
import {StoreProperty} from "../Form/StoreProperty";

const AlgoForm = ({readOnly, onChange, label, relationshipType, direction, persist, writeProperty, labelOptions, relationshipTypeOptions, relationshipOrientationOptions}) => {
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

    return <React.Fragment>
        <ProjectedGraphWithNoWeights {...projectedGraphProps} />
        <StoreProperty persist={persist} onChange={onChange} writeProperty={writeProperty} readOnly={readOnly}/>
    </React.Fragment>
}

export default AlgoForm