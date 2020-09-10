import React from 'react'
import {Form} from "semantic-ui-react"
import StreamOnlyForm from './StreamOnlyForm'

const AlgoForm = ({readOnly, onChange, label, relationshipType, labelOptions, relationshipTypeOptions, direction, persist}) => {
    const relationshipOrientationOptions = [{key: "Undirected", value: "Undirected", text: 'Undirected'}]

    return (
        <Form size='mini' style={{marginBottom: '1em'}}>
            <StreamOnlyForm label={label} readOnly={readOnly} onChange={onChange} relationshipType={relationshipType}
                            relationshipOrientationOptions={relationshipOrientationOptions} direction={direction}
                            persist={persist} labelOptions={labelOptions}
                            relationshipTypeOptions={relationshipTypeOptions}/>
        </Form>
    )
}

export default AlgoForm