import React from 'react'
import {ProjectedGraphWithNoWeights} from "../Form/ProjectedGraph";
import {StoreProperty} from "../Form/StoreProperty";

export default ({relationshipType, onChange, direction, persist, writeProperty, weightProperty, label, labelOptions, relationshipTypeOptions, relationshipOrientationOptions}) => {
    const projectedGraphProps = {
        label,
        labelOptions,
        relationshipType,
        direction,
        relationshipTypeOptions,
        relationshipOrientationOptions,
        weightProperty,
        onChange
    }

    return <React.Fragment>
        <ProjectedGraphWithNoWeights {...projectedGraphProps} />
        <StoreProperty persist={persist} onChange={onChange} writeProperty={writeProperty}/>
    </React.Fragment>
}
