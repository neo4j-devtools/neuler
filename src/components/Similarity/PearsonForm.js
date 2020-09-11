import React from 'react'
import {Form} from "semantic-ui-react"
import WeightedSimilarityForm from "./WeightedSimilarityForm";

const AlgoForm = ({
                      readOnly, children, onChange, labelOptions, relationshipTypeOptions, propertyKeyOptions, writeProperty, writeRelationshipType,
                      similarityCutoff, degreeCutoff, direction, persist, itemLabel, categoryLabel, relationshipType
                  }) => {

    return (
        <Form size='mini' style={{marginBottom: '1em'}}>
            <WeightedSimilarityForm onChange={onChange} direction={direction} writeProperty={writeProperty}
                                    persist={persist} readOnly={readOnly}
                                    labelOptions={labelOptions} writeRelationshipType={writeRelationshipType}
                                    similarityCutoff={similarityCutoff}
                                    itemLabel={itemLabel} categoryLabel={categoryLabel} relationshipType={relationshipType}
                                    degreeCutoff={degreeCutoff} propertyKeyOptions={propertyKeyOptions}
                                    relationshipTypeOptions={relationshipTypeOptions}>{children}</WeightedSimilarityForm>

        </Form>
    )
}

export default AlgoForm