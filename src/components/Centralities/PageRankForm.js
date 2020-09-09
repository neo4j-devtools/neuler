import React, {Component} from 'react'
import {Dropdown, Form, Input, Label, Segment} from "semantic-ui-react"
import {ProjectedGraph} from "../Form/ProjectedGraph";
import {ResultsStorage} from "../Form/ResultsStorage";

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
            <ProjectedGraph {...projectedGraphProps} />
            <PageRankParameters maxIterations={maxIterations} dampingFactor={dampingFactor} onChange={onChange}/>
            <ResultsStorage persist={persist} onChange={onChange} writeProperty={writeProperty}/>

        </Form>
    )
}



const PageRankParameters = ({maxIterations, dampingFactor, onChange}) => {
    return <Segment key={maxIterations}>
        <Label as='a' attached='top left'>
            Algorithm Parameters
        </Label>
        <Form.Field inline>
            <label style={{'width': '8em'}}>Iterations</label>
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
            <label style={{'width': '8em'}}>Damping Factor</label>
            <input
                key={dampingFactor}
                value={dampingFactor}
                onChange={evt => onChange('dampingFactor', evt.target.value)}
                style={{'width': '5em'}}
            />
        </Form.Field>
    </Segment>
}

export default PageRankForm