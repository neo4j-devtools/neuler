import React from 'react'
import {Dropdown, Form, Label, Segment} from "semantic-ui-react"
import {StorePropertyAndRelationshipType} from "../Form/StorePropertyAndRelationshipType";
import {Parameters} from "./Parameters";

const AlgoForm = ({
                      children, readOnly, onChange, direction, itemLabel, categoryLabel, relationshipType, persist, writeProperty, weightProperty,
                      writeRelationshipType, similarityCutoff, degreeCutoff, labelOptions, relationshipTypeOptions, propertyKeyOptions
                  }) => {
    return <React.Fragment>
        <SimilarityGraph
            onChange={onChange} itemLabel={itemLabel} categoryLabel={categoryLabel}
            relationshipTypeOptions={relationshipTypeOptions} weightProperty={weightProperty}
            propertyKeyOptions={propertyKeyOptions} labelOptions={labelOptions} readOnly={readOnly}
            relationshipType={relationshipType}
        />

        <Parameters onChange={onChange} similarityCutoff={similarityCutoff} degreeCutoff={degreeCutoff}
                    readOnly={readOnly}/>

        <StorePropertyAndRelationshipType persist={persist} onChange={onChange}
                                          writeProperty={writeProperty} readOnly={readOnly}
                                          writeRelationshipType={writeRelationshipType}
        >{children}</StorePropertyAndRelationshipType>

    </React.Fragment>
}

const SimilarityGraph = ({itemLabel, labelOptions, onChange, relationshipTypeOptions, relationshipType, categoryLabel, weightProperty, propertyKeyOptions, readOnly}) => {
    const [open, setOpen] = React.useState(true);
    const style = {display: open ? "" : "none"}

    return <Segment>
        <Label as='a' attached='top left' onClick={() => setOpen(!open)}>
            Projected Graph
        </Label>
        <Form style={style}>
            <Form.Field inline className={readOnly ? "disabled" : null}>
                <label style={{'width': '12em'}}>Item Label</label>
                <Dropdown value={itemLabel} placeholder='Item Label' search selection options={labelOptions}
                          onChange={(evt, data) => onChange("itemLabel", data.value)}/>
            </Form.Field>
            <Form.Field inline className={readOnly ? "disabled" : null}>
                <label style={{'width': '12em'}}>Relationship Type</label>
                <Dropdown placeholder='RelationshipType' search selection options={relationshipTypeOptions}
                          value={relationshipType}
                          onChange={(evt, data) => onChange("relationshipType", data.value)}/>
            </Form.Field>

            <Form.Field inline className={readOnly ? "disabled" : null}>
                <label style={{'width': '12em'}}>Weight Property</label>
                <Dropdown placeholder='Weight Property' value={weightProperty} search selection
                          options={propertyKeyOptions}
                          onChange={(evt, data) => onChange("weightProperty", data.value)}/>

            </Form.Field>

            <Form.Field inline className={readOnly ? "disabled" : null}>
                <label style={{'width': '12em'}}>Category Label</label>
                <Dropdown value={categoryLabel} placeholder='Category Label' search selection options={labelOptions}
                          onChange={(evt, data) => onChange("categoryLabel", data.value)}/>
            </Form.Field>
        </Form>
    </Segment>
}

export default AlgoForm