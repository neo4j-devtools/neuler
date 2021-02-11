import React from 'react'
import {Form, Input} from "semantic-ui-react"
import {ProjectedGraphWithWeights} from "../Form/ProjectedGraph";
import {StoreProperty} from "../Form/StoreProperty";
import {OpenCloseSection} from "../Form/OpenCloseSection";

const HITSForm = ({
                          readOnly, label, relationshipType, labelOptions, relationshipTypeOptions, relationshipOrientationOptions,
                          propertyKeyOptions, writeProperty, onChange, hitsIterations,  weightProperty, defaultValue, direction, persist, children
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
            <Parameters hitsIterations={hitsIterations}  onChange={onChange}
                                readOnly={readOnly}/>
            <StoreProperty persist={persist} onChange={onChange} writeProperty={writeProperty}
                           readOnly={readOnly}> {children} </StoreProperty>
        </Form>
    )
}


const Parameters = ({hitsIterations, onChange, readOnly}) => {
    return <OpenCloseSection title="Algorithm Parameters">
        <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>Iterations</label>}
                    control={Input} type='number' value={hitsIterations}
                    onChange={(evt, data) => onChange('hitsIterations', data.value)} min={1} max={50} step={1}/>
    </OpenCloseSection>
}

export default HITSForm
