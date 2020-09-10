import React from 'react'
import {Form, Input, Label, Popup, Segment} from "semantic-ui-react"
import {ProjectedGraphWithWeights} from "../Form/ProjectedGraph";

const AlgoForm = ({onChange, readOnly, relationshipType, label, relationshipOrientationOptions, propertyKeyOptions, labelOptions, relationshipTypeOptions, startNode, weightProperty, defaultValue, direction, persist}) => {
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

            <Parameters startNode={startNode} onChange={onChange} readOnly={readOnly}/>


        </Form>
    )
}

const Parameters = ({onChange, startNode, readOnly}) => {
    return <Segment>
        <Label as='a' attached='top left'>
            Algorithm Parameters
        </Label>
        <Form.Group inline className={readOnly ? "disabled" : null}>
            <label style={{'width': '12em'}}>Start Node</label>
            <Form.Field inline>
                <Popup size="tiny"
                       trigger={<Input basic="true" value={startNode} placeholder='Start Node'
                                       onChange={evt => onChange('startNode', evt.target.value)}/>}
                       content='Populate this field with the value of any property on any node'/>
            </Form.Field>
        </Form.Group>
    </Segment>
}

export default AlgoForm