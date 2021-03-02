import React from 'react'
import {Form, Input} from "semantic-ui-react"
import {ProjectedGraphWithWeights} from "../../../Form/ProjectedGraph";
import {StoreProperty} from "../../../Form/StoreProperty";
import {OpenCloseSection} from "../../../Form/OpenCloseSection";

const Node2VecForm = ({
                          readOnly, label, relationshipType, labelOptions, relationshipTypeOptions, relationshipOrientationOptions,
                          propertyKeyOptions, writeProperty, onChange, weightProperty, defaultValue, direction, persist, children,
                          iterations, embeddingSize, walkLength, inOutFactor, returnFactor
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
            <Parameters iterations={iterations}  onChange={onChange} embeddingSize={embeddingSize}
                                readOnly={readOnly} walkLength={walkLength} inOutFactor={inOutFactor}
                        returnFactor={returnFactor}
            />
            <StoreProperty persist={persist} onChange={onChange} writeProperty={writeProperty}
                           readOnly={readOnly}> {children} </StoreProperty>
        </Form>
    )
}


const Parameters = ({iterations, embeddingSize, walkLength, inOutFactor, returnFactor, onChange, readOnly}) => {
    return <OpenCloseSection title="Algorithm Parameters">
        <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>Iterations</label>}
                    control={Input} type='number' value={iterations}
                    onChange={(evt, data) => onChange('iterations', data.value)} min={1} max={50} step={1}/>

        <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>Embedding Size</label>}
                    control={Input} type='number' value={embeddingSize}
                    onChange={(evt, data) => onChange('embeddingSize', data.value)} min={1} max={500} step={1}/>

        <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>Walk Length</label>}
                    control={Input} type='number' value={walkLength}
                    onChange={(evt, data) => onChange('walkLength', data.value)} min={1} max={500} step={1}/>

        <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>In Out Factor</label>}
                    control={Input} type='number' value={inOutFactor} step={0.01}
                    onChange={(evt, data) => onChange('inOutFactor', data.value)}/>

        <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>Return Factor</label>}
                    control={Input} type='number' value={returnFactor} step={0.01}
                    onChange={(evt, data) => onChange('returnFactor', data.value)}/>

    </OpenCloseSection>
}

export default Node2VecForm
