import React from 'react'
import {Dropdown, Form, Label, Segment} from "semantic-ui-react"
import {StorePropertyAndRelationshipType} from "../Form/StorePropertyAndRelationshipType";
import {Parameters} from "./Parameters";

const AlgoForm = ({
                      children, readOnly, onChange, direction, itemLabel, categoryLabel, persist, writeProperty, weightProperty,
                      writeRelationshipType, similarityCutoff, degreeCutoff, labelOptions, relationshipTypeOptions, propertyKeyOptions
                  }) => {
    return <React.Fragment>
        <SimilarityGraph
            onChange={onChange} itemLabel={itemLabel} categoryLabel={categoryLabel}
            relationshipTypeOptions={relationshipTypeOptions} weightProperty={weightProperty}
            propertyKeyOptions={propertyKeyOptions} labelOptions={labelOptions} readOnly={readOnly}
        />

        <Parameters onChange={onChange} similarityCutoff={similarityCutoff} degreeCutoff={degreeCutoff}
                    readOnly={readOnly}/>

        <StorePropertyAndRelationshipType persist={persist} onChange={onChange}
                                          writeProperty={writeProperty} readOnly={readOnly}
                                          writeRelationshipType={writeRelationshipType}
        >{children}</StorePropertyAndRelationshipType>

    </React.Fragment>
}

const SimilarityGraph = ({itemLabel, labelOptions, onChange, relationshipTypeOptions, categoryLabel, weightProperty, propertyKeyOptions, readOnly}) => {
    return <Segment>
        <Label as='a' attached='top left'>
            Projected Graph
        </Label>
        <Form.Field className={readOnly ? "disabled" : null}>
            <label>Item Label</label>
            <Dropdown value={itemLabel} placeholder='Item Label' fluid search selection options={labelOptions}
                      onChange={(evt, data) => onChange("itemLabel", data.value)}/>
        </Form.Field>
        <Form.Field className={readOnly ? "disabled" : null}>
            <label>Relationship Type</label>
            <Dropdown placeholder='RelationshipType' fluid search selection options={relationshipTypeOptions}
                      onChange={(evt, data) => onChange("relationshipType", data.value)}/>
        </Form.Field>

        <Form.Field className={readOnly ? "disabled" : null}>
            <label>Weight Property</label>
            <Dropdown placeholder='Weight Property' defaultValue={weightProperty} fluid search selection
                      options={propertyKeyOptions} onChange={(evt, data) => onChange("weightProperty", data.value)}/>

        </Form.Field>

        <Form.Field className={readOnly ? "disabled" : null}>
            <label>Category Label</label>
            <Dropdown value={categoryLabel} placeholder='Category Label' fluid search selection options={labelOptions}
                      onChange={(evt, data) => onChange("categoryLabel", data.value)}/>
        </Form.Field>
    </Segment>
}

export default AlgoForm