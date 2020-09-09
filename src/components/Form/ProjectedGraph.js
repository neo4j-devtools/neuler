import {Dropdown, Form, Label, Segment} from "semantic-ui-react";
import React from "react";

export const ProjectedGraph = ({label, labelOptions, relationshipType, direction, relationshipTypeOptions, relationshipOrientationOptions, propertyKeyOptions, weightProperty, defaultValue, onChange}) => {
    return <Segment>
        <Label as='a' attached='top left'>
            Projected Graph
        </Label>
        <Form.Field>
            <label>Label</label>
            <Dropdown placeholder='Label' value={label} fluid search selection options={labelOptions}
                      onChange={(evt, data) => onChange("label", data.value)}/>
        </Form.Field>
        <Form.Field>
            <label>Relationship Type</label>
            <Dropdown placeholder='RelationshipType' value={relationshipType} fluid search selection
                      options={relationshipTypeOptions}
                      onChange={(evt, data) => onChange("relationshipType", data.value)}/>
        </Form.Field>

        {relationshipType ?
            <Form.Field>
                <label>Relationship Orientation</label>
                <Dropdown placeholder='RelationshipOrientation' defaultValue={direction} fluid search selection
                          options={relationshipOrientationOptions}
                          onChange={(evt, data) => onChange("direction", data.value)}/>
            </Form.Field> : null}

        {relationshipType ?
            <Form.Field inline>
                <label style={{'width': '8em'}}>Weight Property</label>
                <Dropdown placeholder='Weight Property' defaultValue={weightProperty} fluid search selection
                          options={propertyKeyOptions}
                          onChange={(evt, data) => onChange("weightProperty", data.value)}/>
            </Form.Field> : null}

        {
            weightProperty ?
                <Form.Field inline>
                    <label style={{'width': '8em'}}>Default weight</label>
                    <input
                        value={defaultValue}
                        onChange={evt => onChange('defaultValue', evt.target.value)}
                        style={{'width': '7em'}}
                    />
                </Form.Field>
                : null

        }
    </Segment>
}