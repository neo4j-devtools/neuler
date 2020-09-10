import React from 'react'
import {Form, Input, Label, Segment} from "semantic-ui-react"
import {ProjectedGraphWithWeights} from "../Form/ProjectedGraph";
import {StoreProperty} from "../Form/StoreProperty";

const PageRankForm = (props) => {
    const {readOnly, label, relationshipType, labelOptions, relationshipTypeOptions, relationshipOrientationOptions, propertyKeyOptions, writeProperty, onChange, maxIterations, dampingFactor, weightProperty, defaultValue, direction, persist} = props
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
            <PageRankParameters maxIterations={maxIterations} dampingFactor={dampingFactor} onChange={onChange} readOnly={readOnly}/>
            <StoreProperty persist={persist} onChange={onChange} writeProperty={writeProperty} readOnly={readOnly}/>
        </Form>
    )
}


const PageRankParameters = ({maxIterations, dampingFactor, onChange, readOnly}) => {
    return <Segment>
        <Label as='a' attached='top left'>
            Algorithm Parameters
        </Label>

        <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>Iterations</label>}
                    control={Input} type='number' value={maxIterations}
                    onChange={(evt, data) => onChange('maxIterations', data.value)} min={1} max={50} step={1}/>

        <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>Damping Factor</label>}
                    control={Input} type='number' value={dampingFactor} step={0.01}
                    onChange={(evt, data) => onChange('dampingFactor', data.value)}/>
    </Segment>
}

export default PageRankForm