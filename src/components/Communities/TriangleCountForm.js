import React from 'react'
import {Form} from "semantic-ui-react"
import CommunityForm from './CommunityForm'

const AlgoForm = ({readOnly, onChange, label, labelOptions, relationshipType, relationshipTypeOptions, writeProperty, direction, persist, children}) => {
    const relationshipOrientationOptions = [{key: "Undirected", value: "Undirected", text: 'Undirected'}]
    return (
        <Form size='mini' style={{marginBottom: '1em'}}>
            <CommunityForm onChange={onChange} readOnly={readOnly} direction={direction} persist={persist} writeProperty={writeProperty}
                           labelOptions={labelOptions}
                           label={label}
                           relationshipType={relationshipType}
                           relationshipOrientationOptions={relationshipOrientationOptions}
                           relationshipTypeOptions={relationshipTypeOptions}>
                {children}
            </CommunityForm>
        </Form>
    )
}

export default AlgoForm