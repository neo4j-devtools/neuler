import React from 'react'
import {Form, Input, Label, Segment} from "semantic-ui-react"
import {ProjectedGraphWithWeights} from "../Form/ProjectedGraph";
import {StoreProperty} from "../Form/StoreProperty";

const AlgoForm = ({readOnly, onChange, label, labelOptions, maxIterations, relationshipType, relationshipTypeOptions, relationshipOrientationOptions, propertyKeyOptions, weightProperty, writeProperty, defaultValue, direction, persist}) => {
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
            <Parameters maxIterations={maxIterations} onChange={onChange} readOnly={readOnly}/>
            <StoreProperty persist={persist} onChange={onChange} writeProperty={writeProperty} readOnly={readOnly}/>
        </Form>
    )
}


const Parameters = ({maxIterations, onChange, readOnly}) => {
    return <Segment key={maxIterations}>
        <Label as='a' attached='top left'>
            Algorithm Parameters
        </Label>
        <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>Iterations</label>}
                    control={Input} type='number' value={maxIterations}
                    onChange={(evt, data) => onChange('maxIterations', data.value)} min={1} max={50} step={1}/>
    </Segment>
}

export default AlgoForm