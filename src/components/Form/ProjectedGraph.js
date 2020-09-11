import {Dropdown, Form, Input, Label, Segment} from "semantic-ui-react";
import React from "react";

const ProjectedGraph = ({readOnly, label, labelOptions, relationshipType, direction, relationshipTypeOptions, relationshipOrientationOptions, propertyKeyOptions, weightProperty, defaultValue, onChange, showWeightProperty}) => {
    const [open, setOpen] = React.useState(true);
    const style = {display: open ? "" : "none"}

    return <Segment>
        <Label as='a' attached='top left' onClick={() => setOpen(!open)}>
            Projected Graph
        </Label>
        <Form style={style}>
            <Form.Field inline  className={readOnly ? "disabled" : null}>
                <label style={{'width': '12em'}}>Label</label>
                <Dropdown disabled={readOnly} placeholder='Label' value={label}  search selection
                          options={labelOptions}
                          onChange={(evt, data) => onChange("label", data.value)}/>
            </Form.Field>
            <Form.Field inline  className={readOnly ? "disabled" : null}>
                <label style={{'width': '12em'}}>Relationship Type</label>
                <Dropdown disabled={readOnly} placeholder='RelationshipType' value={relationshipType}  search
                          selection
                          options={relationshipTypeOptions}
                          onChange={(evt, data) => onChange("relationshipType", data.value)}/>
            </Form.Field>

            {relationshipType ?
                <Form.Field inline className={readOnly ? "disabled" : null}>
                    <label style={{'width': '12em'}}>Relationship Orientation</label>
                    <Dropdown disabled={readOnly} placeholder='RelationshipOrientation' value={direction}
                              search selection
                              options={relationshipOrientationOptions}
                              onChange={(evt, data) => onChange("direction", data.value)}/>
                </Form.Field> : null}

            {showWeightProperty && relationshipType ?
                <Form.Field inline className={readOnly ? "disabled" : null}>
                    <label style={{'width': '12em'}}>Weight Property</label>
                    <Dropdown disabled={readOnly} placeholder='Weight Property' value={weightProperty}
                              search selection
                              options={propertyKeyOptions}
                              onChange={(evt, data) => onChange("weightProperty", data.value)}/>
                </Form.Field> : null}

            {showWeightProperty && weightProperty ?
                <Form.Field inline className={readOnly ? "disabled" : null}>
                    <label style={{'width': '12em'}}>Default weight</label>
                    <Input disabled={readOnly} size='mini' basic="true" value={defaultValue}
                           onChange={evt => onChange('defaultValue', evt.target.value)}/>

                </Form.Field>

                : null

            }
        </Form>
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