import React from 'react'
import {Form, Input} from "semantic-ui-react"
import {ProjectedGraphWithWeights} from "../../Form/ProjectedGraph";
import {StoreProperty} from "../../Form/StoreProperty";
import {OpenCloseSection} from "../../Form/OpenCloseSection";

const SLLPAForm = ({
                       readOnly,
                       onChange,
                       labelOptions,
                       label,
                       relationshipType,
                       relationshipTypeOptions,
                       relationshipOrientationOptions,
                       propertyKeyOptions,
                       weightProperty,
                       writeProperty,
                       maxIterations,
                       minAssociationStrength,
                       defaultValue,
                       direction,
                       persist,
                       children
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

    const parameterProps = {
        maxIterations, minAssociationStrength, onChange, readOnly
    }

    return (
        <Form size='mini' style={{marginBottom: '1em'}}>
            <ProjectedGraphWithWeights {...projectedGraphProps} />
            <Parameters {...parameterProps} />
            <StoreProperty persist={persist} onChange={onChange} writeProperty={writeProperty} readOnly={readOnly}>
                {children}
            </StoreProperty>
        </Form>
    )

}

const Parameters = ({maxIterations, minAssociationStrength, onChange, readOnly}) => {
    return <OpenCloseSection title="Algorithm Parameters">
        <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>Iterations</label>}
                    control={Input} type='number' value={maxIterations}
                    onChange={(evt, data) => onChange('maxIterations', data.value)} min={1} max={50} step={1}/>


        <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>Min Association Strength</label>}
                    control={Input} type='number' value={minAssociationStrength} step={0.01}
                    onChange={(evt, data) => onChange('minAssociationStrength', data.value)}/>
    </OpenCloseSection>
}
export default SLLPAForm
