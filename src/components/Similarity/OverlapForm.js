import React from 'react'
import {Dropdown, Form} from "semantic-ui-react"
import {Parameters} from "./Parameters";
import {StorePropertyAndRelationshipType} from "../Form/StorePropertyAndRelationshipType";
import {OpenCloseSection} from "../Form/OpenCloseSection";

const AlgoForm = ({readOnly, onChange, children, itemLabel, categoryLabel, labelOptions, relationshipType, relationshipTypeOptions, writeProperty, writeRelationshipType, similarityCutoff, degreeCutoff, direction, persist}) => {

    return (
        <Form size='mini' style={{marginBottom: '1em'}}>
            <SimilarityGraph onChange={onChange}
                             relationshipTypeOptions={relationshipTypeOptions}
                             itemLabel={itemLabel}
                             relationshipType={relationshipType}
                             categoryLabel={categoryLabel}
                             readOnly={readOnly}
                             labelOptions={labelOptions}
            />

            <Parameters onChange={onChange} similarityCutoff={similarityCutoff} degreeCutoff={degreeCutoff}
                        readOnly={readOnly}/>

            <StorePropertyAndRelationshipType persist={persist} onChange={onChange}
                                              writeProperty={writeProperty} readOnly={readOnly}
                                              writeRelationshipType={writeRelationshipType}
            >{children}</StorePropertyAndRelationshipType>

        </Form>
    )
}

const SimilarityGraph = ({labelOptions, onChange, relationshipTypeOptions, itemLabel, categoryLabel, readOnly, relationshipType}) => {
    return <OpenCloseSection title="Projected Graph">
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
            <label style={{'width': '12em'}}>Category Label</label>
            <Dropdown value={categoryLabel} placeholder='Category Label' search selection options={labelOptions}
                      onChange={(evt, data) => onChange("categoryLabel", data.value)}/>
        </Form.Field>
    </OpenCloseSection>
}


export default AlgoForm