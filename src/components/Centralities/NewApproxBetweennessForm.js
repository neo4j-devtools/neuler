import React from 'react'
import {Form, Input, Label, Segment} from "semantic-ui-react"
import {ProjectedGraphWithNoWeights} from "../Form/ProjectedGraph";
import {StoreProperty} from "../Form/StoreProperty";

export default ({readOnly, onChange, labelOptions, relationshipTypeOptions, relationshipOrientationOptions, label, relationshipType, writeProperty, direction, persist, maxDepth, strategy, probability, samplingSize, children}) => {
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

    return <Form size='mini' style={{marginBottom: '1em'}}>
        <ProjectedGraphWithNoWeights {...projectedGraphProps} />
        <Parameters samplingSize={samplingSize} onChange={onChange} readOnly={readOnly}/>
        <StoreProperty persist={persist} onChange={onChange} writeProperty={writeProperty} readOnly={readOnly}>
            {children}
        </StoreProperty>
    </Form>
}

const Parameters = ({samplingSize, onChange, readOnly}) => {
    return <Segment>
        <Label as='a' attached='top left'>
            Algorithm Parameters
        </Label>
        <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>Sampling size</label>}
                    control={Input} type='number' value={samplingSize} onChange={evt => onChange('samplingSize', evt.target.value)}
                    min={1} step={1} />

    </Segment>
}