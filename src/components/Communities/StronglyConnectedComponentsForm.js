import React from 'react'
import {Form} from "semantic-ui-react"
import CommunityForm from './CommunityForm'

const AlgoForm = ({ readOnly, onChange, relationshipType, label, relationshipOrientationOptions, labelOptions, relationshipTypeOptions, writeProperty, direction, persist, children }) => {
    return (
      <Form size='mini' style={{ marginBottom: '1em' }}>
        <CommunityForm readOnly={readOnly} label={label} relationshipOrientationOptions={relationshipOrientationOptions} relationshipType={relationshipType} onChange={onChange} direction={direction} persist={persist} writeProperty={writeProperty}  labelOptions={labelOptions} relationshipTypeOptions={relationshipTypeOptions}>
            {children}
        </CommunityForm>
      </Form>
    )

}

export default AlgoForm