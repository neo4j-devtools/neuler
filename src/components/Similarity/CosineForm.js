import React from 'react'
import {Form} from "semantic-ui-react"
import WeightedSimilarityForm from "./WeightedSimilarityForm";

const AlgoForm = ({children, onChange, readOnly, labelOptions, itemLabel, categoryLabel, relationshipType, relationshipTypeOptions, propertyKeyOptions, writeProperty, writeRelationshipType, similarityCutoff, degreeCutoff, direction, persist}) => {

    return (
        <Form size='mini' style={{marginBottom: '1em'}}>
            <WeightedSimilarityForm onChange={onChange} direction={direction} writeProperty={writeProperty}
                                    persist={persist} readOnly={readOnly}
                                    itemLabel={itemLabel} categoryLabel={categoryLabel} relationshipType={relationshipType}
                                    labelOptions={labelOptions} writeRelationshipType={writeRelationshipType}
                                    similarityCutoff={similarityCutoff}
                                    degreeCutoff={degreeCutoff} propertyKeyOptions={propertyKeyOptions}
                                    relationshipTypeOptions={relationshipTypeOptions}>
                {children}
            </WeightedSimilarityForm>

        </Form>
    )
}


export default AlgoForm