import React from 'react'
import {Form, Input} from "semantic-ui-react"
import {ProjectedGraphWithWeights} from "../../../Form/ProjectedGraph";
import {StoreProperty} from "../../../Form/StoreProperty";
import {OpenCloseSection} from "../../../Form/OpenCloseSection";

const FastRPForm = ({
                          readOnly, label, relationshipType, labelOptions, relationshipTypeOptions, relationshipOrientationOptions,
                          propertyKeyOptions, writeProperty, onChange, weightProperty, defaultValue, direction, persist, children,
                          embeddingSize, normalizationStrength, maxIterations
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
            <Parameters normalizationStrength={normalizationStrength}  onChange={onChange}
                        embeddingSize={embeddingSize} readOnly={readOnly} maxIterations={maxIterations}
            />
            <StoreProperty persist={persist} onChange={onChange} writeProperty={writeProperty}
                           readOnly={readOnly}> {children} </StoreProperty>
        </Form>
    )
}


const Parameters = ({ embeddingSize, normalizationStrength, onChange, readOnly, maxIterations}) => {
    return <OpenCloseSection title="Algorithm Parameters">
        <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>Iterations</label>}
                    control={Input} type='number' value={maxIterations}
                    onChange={(evt, data) => onChange('maxIterations', data.value)} min={1} max={500} step={1}/>

        <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>Embedding Size</label>}
                    control={Input} type='number' value={embeddingSize}
                    onChange={(evt, data) => onChange('embeddingSize', data.value)} min={1} max={500} step={1}/>

        <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>Normalization Strength</label>}
                    control={Input} type='number' value={normalizationStrength} step={0.01}
                    onChange={(evt, data) => onChange('normalizationStrength', data.value)}/>

    </OpenCloseSection>
}

export default FastRPForm
