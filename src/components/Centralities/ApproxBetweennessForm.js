import React from 'react'
import {Form} from "semantic-ui-react"
import {ProjectedGraphWithNoWeights} from "../Form/ProjectedGraph";
import {StoreProperty} from "../Form/StoreProperty";
import {OpenCloseSection} from "../Form/OpenCloseSection";

export default ({onChange, labelOptions, relationshipTypeOptions, relationshipOrientationOptions, label, relationshipType, writeProperty, direction, persist, maxDepth, strategy, probability}) => {
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
        <Parameters strategy={strategy} maxDepth={maxDepth} probability={probability}
                                     onChange={onChange}/>
        <StoreProperty persist={persist} onChange={onChange} writeProperty={writeProperty}/>
    </Form>
}

const Parameters = ({strategy, maxDepth, probability, onChange}) => {
    return <OpenCloseSection title="Algorithm Parameters">
        <Form.Group inline>
            <label style={{'width': '8em'}}>Strategy</label>
            <Form.Radio
                label='Degree'
                name='radioGroupStrategy'
                value='degree'
                checked={strategy === 'degree'}
                onChange={() => onChange('strategy', 'degree')}
            />
            <Form.Radio
                label='Random'
                name='radioGroupStrategy'
                value='random'
                checked={strategy === 'random'}
                onChange={() => onChange('strategy', 'random')}
            />
        </Form.Group>
        <Form.Field inline>
            <label style={{'width': '8em'}}>Max Depth</label>
            <input
                type='number'
                min={1}
                max={50}
                step={1}
                value={maxDepth}
                onChange={evt => onChange('maxDepth', evt.target.value)}
                style={{'width': '5em'}}
            />
        </Form.Field>
        <Form.Field inline>
            <label style={{'width': '8em'}}>Probability</label>
            <input
                value={probability}
                onChange={evt => onChange('probability', evt.target.value)}
                style={{'width': '5em'}}
            />
        </Form.Field>
    </OpenCloseSection>
}