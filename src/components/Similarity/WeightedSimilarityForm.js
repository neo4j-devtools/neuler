import React from 'react'
import {Dropdown, Form, Input, Label, Segment} from "semantic-ui-react"
import {StorePropertyAndRelationshipType} from "../Form/StorePropertyAndRelationshipType";
import {Parameters} from "./Parameters";

const AlgoForm = ({onChange, direction, itemLabel, categoryLabel,  persist, writeProperty, weightProperty, writeRelationshipType, similarityCutoff, degreeCutoff, labelOptions, relationshipTypeOptions, propertyKeyOptions}) => {
    return <React.Fragment>
        <SimilarityGraph
            onChange={onChange} itemLabel={itemLabel} categoryLabel={categoryLabel} relationshipTypeOptions={relationshipTypeOptions} weightProperty={weightProperty}
            propertyKeyOptions={propertyKeyOptions} labelOptions={labelOptions}
        />

        <Parameters onChange={onChange} similarityCutoff={similarityCutoff} degreeCutoff={degreeCutoff}/>

        <StorePropertyAndRelationshipType persist={persist} onChange={onChange}
                                          writeProperty={writeProperty}
                                          writeRelationshipType={writeRelationshipType}
        />

    </React.Fragment>
}

const SimilarityGraph = ({itemLabel, labelOptions, onChange, relationshipTypeOptions, categoryLabel, weightProperty, propertyKeyOptions}) => {
    return <Segment>
        <Label as='a' attached='top left'>
            Projected Graph
        </Label>
        <Form.Field>
            <label>Item Label</label>
            <Dropdown value={itemLabel} placeholder='Item Label' fluid search selection options={labelOptions}
                      onChange={(evt, data) => onChange("itemLabel", data.value)}/>
        </Form.Field>
        <Form.Field>
            <label>Relationship Type</label>
            <Dropdown placeholder='RelationshipType' fluid search selection options={relationshipTypeOptions}
                      onChange={(evt, data) => onChange("relationshipType", data.value)}/>
        </Form.Field>

        <Form.Field>
            <label>Weight Property</label>
            <Dropdown placeholder='Weight Property' defaultValue={weightProperty} fluid search selection
                      options={propertyKeyOptions} onChange={(evt, data) => onChange("weightProperty", data.value)}/>

        </Form.Field>

        <Form.Field>
            <label>Category Label</label>
            <Dropdown value={categoryLabel} placeholder='Category Label' fluid search selection options={labelOptions}
                      onChange={(evt, data) => onChange("categoryLabel", data.value)}/>
        </Form.Field>
    </Segment>
}

export default AlgoForm