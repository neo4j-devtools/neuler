import React from 'react'
import {ProjectedGraphWithNoWeights} from "../Form/ProjectedGraph";
import {StoreProperty} from "../Form/StoreProperty";

export default ({relationshipType, readOnly, onChange, direction, persist, writeProperty, weightProperty, label, labelOptions, relationshipTypeOptions, relationshipOrientationOptions, children}) => {
    const projectedGraphProps = {
        label,
        labelOptions,
        relationshipType,
        direction,
        relationshipTypeOptions,
        relationshipOrientationOptions,
        weightProperty,
        onChange,
        readOnly
    }

    return <React.Fragment>
        <ProjectedGraphWithNoWeights {...projectedGraphProps} />
        <StoreProperty persist={persist} onChange={onChange} writeProperty={writeProperty} readOnly={readOnly}>{children}</StoreProperty>
    </React.Fragment>
}
