import React from 'react'
import {Form, Input} from "semantic-ui-react"
import {ProjectedGraphWithWeights} from "../Form/ProjectedGraph";
import {StoreProperty} from "../Form/StoreProperty";
import {OpenCloseSection} from "../Form/OpenCloseSection";

const PageRankForm = ({
                          readOnly, label, relationshipType, labelOptions, relationshipTypeOptions, relationshipOrientationOptions,relPropertyKeyOptions,
                          propertyKeyOptions, writeProperty, onChange, maxIterations, dampingFactor, weightProperty, defaultValue, direction, persist, children
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
        readOnly,
        relPropertyKeyOptions
    }

    return (
        <Form size='mini' style={{marginBottom: '1em'}}>
            <ProjectedGraphWithWeights {...projectedGraphProps} />
            <PageRankParameters maxIterations={maxIterations} dampingFactor={dampingFactor} onChange={onChange}
                                readOnly={readOnly}/>
            <StoreProperty persist={persist} onChange={onChange} writeProperty={writeProperty}
                           readOnly={readOnly}> {children} </StoreProperty>
        </Form>
    )
}


const PageRankParameters = ({maxIterations, dampingFactor, onChange, readOnly}) => {
    return <OpenCloseSection title="Algorithm Parameters">
        <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>Iterations</label>}
                    control={Input} type='number' value={maxIterations}
                    onChange={(evt, data) => onChange('maxIterations', data.value)} min={1} max={50} step={1}/>

        <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>Damping Factor</label>}
                    control={Input} type='number' value={dampingFactor} step={0.01}
                    onChange={(evt, data) => onChange('dampingFactor', data.value)}/>
    </OpenCloseSection>
}

export default PageRankForm