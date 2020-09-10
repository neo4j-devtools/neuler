import React from 'react'
import {Form, Label, Segment} from "semantic-ui-react"
import {ProjectedGraphWithWeights} from "../Form/ProjectedGraph";
import {StoreProperty} from "../Form/StoreProperty";

const PageRankForm = (props) => {
    const {label, relationshipType, labelOptions, relationshipTypeOptions, relationshipOrientationOptions, propertyKeyOptions, writeProperty, onChange, maxIterations, dampingFactor, weightProperty, defaultValue, direction, persist} = props
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
            <PageRankParameters maxIterations={maxIterations} dampingFactor={dampingFactor} onChange={onChange}/>
            <StoreProperty persist={persist} onChange={onChange} writeProperty={writeProperty}/>

        </Form>
    )
}



const PageRankParameters = ({maxIterations, dampingFactor, onChange}) => {
    return <Segment key={maxIterations}>
        <Label as='a' attached='top left'>
            Algorithm Parameters
        </Label>
        <Form.Field inline>
            <label style={{'width': '12em'}}>Iterations</label>
            <input
                key={maxIterations}
                type='number'
                min={1}
                max={50}
                step={1}
                value={maxIterations}
                onChange={evt => onChange('maxIterations', evt.target.value)}
                style={{'width': '5em'}}
            />
        </Form.Field>
        <Form.Field inline>
            <label style={{'width': '12em'}}>Damping Factor</label>
            <input
                key={dampingFactor}
                value={dampingFactor}
                onChange={evt => onChange('dampingFactor', evt.target.value)}
                style={{'width': '12em'}}
            />
        </Form.Field>
    </Segment>
}

export default PageRankForm