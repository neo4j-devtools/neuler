import React from 'react'
import {Form, Button, Checkbox} from "semantic-ui-react"
import CentralityForm from "./CentralityForm"

export default ({ onChange, labelOptions, writeProperty, relationshipTypeOptions, direction, persist, concurrency, maxDepth }) => (
  <Form size='mini' style={{ marginBottom: '1em' }}>
    <CentralityForm onChange={onChange} direction={direction} writeProperty={writeProperty} persist={persist} concurrency={concurrency} labelOptions={labelOptions} relationshipTypeOptions={relationshipTypeOptions} />

  </Form>
)
