import React from 'react'
import {Form, Label, Segment} from "semantic-ui-react"
import {ProjectedGraphWithNoWeights} from "../Form/ProjectedGraph";
import {StoreProperty} from "../Form/StoreProperty";

export default ({onChange, labelOptions, relationshipTypeOptions, relationshipOrientationOptions, label, relationshipType, writeProperty, direction, persist, maxDepth, strategy, probability, samplingSize}) => {
    const projectedGraphProps = {
        label,
        labelOptions,
        relationshipType,
        direction,
        relationshipTypeOptions,
        relationshipOrientationOptions,
        onChange
    }

    return <Form size='mini' style={{marginBottom: '1em'}}>
        <ProjectedGraphWithNoWeights {...projectedGraphProps} />
        <Parameters samplingSize={samplingSize} onChange={onChange}/>
        <StoreProperty persist={persist} onChange={onChange} writeProperty={writeProperty}/>
    </Form>
}

const Parameters = ({samplingSize, onChange}) => {
    return <Segment key={samplingSize}>
        <Label as='a' attached='top left'>
            Algorithm Parameters
        </Label>
        <Form.Field inline>
            <label style={{'width': '12em'}}>Sampling size</label>
            <input
                type='number'
                min={1}
                step={1}
                value={samplingSize}
                onChange={evt => onChange('samplingSize', evt.target.value)}
                style={{'width': '8em'}}
            />
        </Form.Field>
    </Segment>
}