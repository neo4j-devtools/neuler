import React from 'react'
import {Form} from "semantic-ui-react"
import CommunityForm from './CommunityForm'

const AlgoForm = ({readOnly, label, onChange, labelOptions, relationshipType, relationshipTypeOptions, writeProperty, direction, persist, children}) => {
    const relationshipOrientationOptions = [{key: "Undirected", value: "Undirected", text: 'Undirected'}]

    return (
        <Form size='mini' style={{marginBottom: '1em'}}>
            <CommunityForm readOnly={readOnly} onChange={onChange} direction={direction} persist={persist} writeProperty={writeProperty}
                           labelOptions={labelOptions} label={label}
                           relationshipType={relationshipType}
                           relationshipOrientationOptions={relationshipOrientationOptions}
                           relationshipTypeOptions={relationshipTypeOptions}>
                {children}
            </CommunityForm>

        </Form>
    )
}

export default AlgoForm