import React from 'react'
import {Form} from "semantic-ui-react"
import CommunityForm from './CommunityForm'

const AlgoForm = ({readOnly, onChange, labelOptions, relationshipType, relationshipTypeOptions, writeProperty, direction, persist}) => {
    const relationshipOrientationOptions = [{key: "Undirected", value: "Undirected", text: 'Undirected'}]
    return (
        <Form size='mini' style={{marginBottom: '1em'}}>
            <CommunityForm onChange={onChange} readOnly={readOnly} direction={direction} persist={persist} writeProperty={writeProperty}
                           labelOptions={labelOptions}
                           relationshipType={relationshipType}
                           relationshipOrientationOptions={relationshipOrientationOptions}
                           relationshipTypeOptions={relationshipTypeOptions}/>
        </Form>
    )
}

export default AlgoForm