import React from 'react'
import {Form, Label, Segment} from "semantic-ui-react"
import {ProjectedGraphWithWeights} from "../Form/ProjectedGraph";
import {ResultsStorage} from "../Form/ResultsStorage";

const AlgoForm = ({onChange, label, labelOptions, maxIterations, relationshipType, relationshipTypeOptions, relationshipOrientationOptions, propertyKeyOptions, weightProperty, writeProperty, defaultValue, direction, persist}) => {
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
        onChange
    }

    return (
        <Form size='mini' style={{marginBottom: '1em'}}>
            <ProjectedGraphWithWeights {...projectedGraphProps} />
            <Parameters maxIterations={maxIterations} onChange={onChange}/>
            <ResultsStorage persist={persist} onChange={onChange} writeProperty={writeProperty}/>
        </Form>
    )
}


const Parameters = ({maxIterations, onChange}) => {
    return <Segment key={maxIterations}>
        <Label as='a' attached='top left'>
            Algorithm Parameters
        </Label>
        <Form.Field inline>
            <label style={{'width': '12em'}}>Iterations</label>
            <input
                type='number'
                min={1}
                max={50}
                step={1}
                value={maxIterations}
                onChange={evt => onChange('maxIterations', evt.target.value)}
                style={{'width': '5em'}}
            />
        </Form.Field>
    </Segment>
}

export default AlgoForm