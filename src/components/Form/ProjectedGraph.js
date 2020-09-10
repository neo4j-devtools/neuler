import {Dropdown, Form, Input, Label, Segment} from "semantic-ui-react";
import React from "react";

const ProjectedGraph = ({readOnly, label, labelOptions, relationshipType, direction, relationshipTypeOptions, relationshipOrientationOptions, propertyKeyOptions, weightProperty, defaultValue, onChange, showWeightProperty}) => {
    return <Segment>
        <Label as='a' attached='top left'>
            Projected Graph
        </Label>
        <Form.Field>
            <label>Label</label>
            <Dropdown disabled={readOnly} placeholder='Label' value={label} fluid search selection options={labelOptions}
                      onChange={(evt, data) => onChange("label", data.value)}/>
        </Form.Field>
        <Form.Field>
            <label>Relationship Type</label>
            <Dropdown disabled={readOnly} placeholder='RelationshipType' value={relationshipType} fluid search selection
                      options={relationshipTypeOptions}
                      onChange={(evt, data) => onChange("relationshipType", data.value)}/>
        </Form.Field>

        {relationshipType ?
            <Form.Field>
                <label>Relationship Orientation</label>
                <Dropdown disabled={readOnly} placeholder='RelationshipOrientation' defaultValue={direction} fluid search selection
                          options={relationshipOrientationOptions}
                          onChange={(evt, data) => onChange("direction", data.value)}/>
            </Form.Field> : null}

        {showWeightProperty && relationshipType ?
            <Form.Field inline>
                <label style={{'width': '8em'}}>Weight Property</label>
                <Dropdown disabled={readOnly} placeholder='Weight Property' defaultValue={weightProperty} fluid search selection
                          options={propertyKeyOptions}
                          onChange={(evt, data) => onChange("weightProperty", data.value)}/>
            </Form.Field> : null}

        {showWeightProperty && weightProperty ?
            <Form.Field inline>
                <label style={{'width': '8em'}}>Default weight</label>
                <Input disabled={readOnly} size='mini' basic="true" value={defaultValue} onChange={evt => onChange('defaultValue', evt.target.value)}/>

            </Form.Field>
            : null

        }
    </Segment>
}

export const ProjectedGraphWithWeights = (props) => {
    const projectedGraphProps = {
        ...props,
        showWeightProperty: true
    }

    return <ProjectedGraph {...projectedGraphProps} />
}

export const ProjectedGraphWithNoWeights = (props) => {
    const projectedGraphProps = {
        ...props,
        showWeightProperty: false
    }

    return <ProjectedGraph {...projectedGraphProps} />
}