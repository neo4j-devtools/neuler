import React, {Component} from 'react'
import {Form} from "semantic-ui-react"
import CommunityForm from './CommunityForm'

const AlgoForm = ({ onChange, relationshipType, label, relationshipOrientationOptions, labelOptions, relationshipTypeOptions, writeProperty, direction, persist }) => {
    return (
      <Form size='mini' style={{ marginBottom: '1em' }}>
        <CommunityForm label={label} relationshipOrientationOptions={relationshipOrientationOptions} relationshipType={relationshipType} onChange={onChange} direction={direction} persist={persist} writeProperty={writeProperty}  labelOptions={labelOptions} relationshipTypeOptions={relationshipTypeOptions}/>
      </Form>
    )

}

export default AlgoForm