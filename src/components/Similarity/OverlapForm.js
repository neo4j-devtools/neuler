import React from 'react'
import {Dropdown, Form, Label, Segment} from "semantic-ui-react"
import {Parameters} from "./Parameters";
import {StorePropertyAndRelationshipType} from "../Form/StorePropertyAndRelationshipType";

const AlgoForm = ({readOnly, onChange, itemLabel, categoryLabel, labelOptions, relationshipTypeOptions, writeProperty, writeRelationshipType, similarityCutoff, degreeCutoff, direction, persist}) => {

    return (
        <Form size='mini' style={{marginBottom: '1em'}}>
            <SimilarityGraph onChange={onChange}
                             relationshipTypeOptions={relationshipTypeOptions}
                             itemLabel={itemLabel}
                             categoryLabel={categoryLabel}
                             readOnly={readOnly}
                             labelOptions={labelOptions}
            />

            <Parameters onChange={onChange} similarityCutoff={similarityCutoff} degreeCutoff={degreeCutoff} readOnly={readOnly}/>

            <StorePropertyAndRelationshipType persist={persist} onChange={onChange}
                                              writeProperty={writeProperty} readOnly={readOnly}
                                              writeRelationshipType={writeRelationshipType}
            />

        </Form>
    )
}

const SimilarityGraph = ({labelOptions, onChange, relationshipTypeOptions, itemLabel, categoryLabel, readOnly}) => {
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
            <label>Category Label</label>
            <Dropdown value={categoryLabel} placeholder='Category Label' fluid search selection options={labelOptions}
                      onChange={(evt, data) => onChange("categoryLabel", data.value)}/>
        </Form.Field>
    </Segment>
}


export default AlgoForm