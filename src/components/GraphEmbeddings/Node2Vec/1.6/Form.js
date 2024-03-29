import React from 'react'
import {Form, Input} from "semantic-ui-react"
import {ProjectedGraphWithWeights} from "../../../Form/ProjectedGraph";
import {StoreProperty} from "../../../Form/StoreProperty";
import {OpenCloseSection} from "../../../Form/OpenCloseSection";

const Node2VecForm = ({
                          readOnly, label, relationshipType, labelOptions, relationshipTypeOptions, relationshipOrientationOptions,
                          propertyKeyOptions, writeProperty, onChange, weightProperty, defaultValue, direction, persist, children,
                          iterations, embeddingDimension, walkLength, inOutFactor, returnFactor, windowSize, relPropertyKeyOptions
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
            <Parameters iterations={iterations}  onChange={onChange} embeddingDimension={embeddingDimension}
                                readOnly={readOnly} walkLength={walkLength} inOutFactor={inOutFactor}
                        returnFactor={returnFactor} windowSize={windowSize}
            />
            <StoreProperty persist={persist} onChange={onChange} writeProperty={writeProperty}
                           readOnly={readOnly}> {children} </StoreProperty>
        </Form>
    )
}


const Parameters = ({iterations, embeddingDimension, walkLength, inOutFactor, returnFactor, onChange, readOnly, windowSize}) => {
    return <OpenCloseSection title="Algorithm Parameters">
        <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>Iterations</label>}
                    control={Input} type='number' value={iterations}
                    onChange={(evt, data) => onChange('iterations', data.value)} min={1} max={50} step={1}/>

        <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>Embedding Dimension</label>}
                    control={Input} type='number' value={embeddingDimension}
                    onChange={(evt, data) => onChange('embeddingDimension', data.value)} min={1} max={500} step={1}/>

        <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>Walk Length</label>}
                    control={Input} type='number' value={walkLength}
                    onChange={(evt, data) => onChange('walkLength', data.value)} min={1} max={500} step={1}/>

        <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>In Out Factor</label>}
                    control={Input} type='number' value={inOutFactor} step={0.01}
                    onChange={(evt, data) => onChange('inOutFactor', data.value)}/>

        <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>Return Factor</label>}
                    control={Input} type='number' value={returnFactor} step={0.01}
                    onChange={(evt, data) => onChange('returnFactor', data.value)}/>

        <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>Window Size</label>}
                    control={Input} type='number' value={windowSize} step={1}
                    onChange={(evt, data) => onChange('windowSize', data.value)}/>

    </OpenCloseSection>
}

export default Node2VecForm
