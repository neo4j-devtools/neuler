import React from 'react'
import {Form, Input} from "semantic-ui-react"
import {ProjectedGraphWithWeights} from "../../../Form/ProjectedGraph";
import {StoreProperty} from "../../../Form/StoreProperty";
import {OpenCloseSection} from "../../../Form/OpenCloseSection";

const FastRPForm = ({
                          readOnly, label, relationshipType, labelOptions, relationshipTypeOptions, relationshipOrientationOptions,
                          propertyKeyOptions, writeProperty, onChange, weightProperty, defaultValue, direction, persist, children,
                          embeddingDimension, normalizationStrength, relPropertyKeyOptions
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
            <Parameters normalizationStrength={normalizationStrength}  onChange={onChange}
                        embeddingDimension={embeddingDimension}
                                readOnly={readOnly}
            />
            <StoreProperty persist={persist} onChange={onChange} writeProperty={writeProperty}
                           readOnly={readOnly}> {children} </StoreProperty>
        </Form>
    )
}


const Parameters = ({ embeddingDimension, normalizationStrength, onChange, readOnly}) => {
    return <OpenCloseSection title="Algorithm Parameters">
        <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>Embedding Dimension</label>}
                    control={Input} type='number' value={embeddingDimension}
                    onChange={(evt, data) => onChange('embeddingDimension', data.value)} min={1} max={500} step={1}/>

        <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>Normalization Strength</label>}
                    control={Input} type='number' value={normalizationStrength} step={0.01}
                    onChange={(evt, data) => onChange('normalizationStrength', data.value)}/>

    </OpenCloseSection>
}

export default FastRPForm
