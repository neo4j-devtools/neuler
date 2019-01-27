import React from 'react'
import {Form, Button, Checkbox} from "semantic-ui-react"
import CentralityForm from "./CentralityForm"

export default ({ onChange, direction }) => (
  <Form size='mini' style={{ marginBottom: '1em' }}>
    <CentralityForm onChange={onChange} direction={direction}/>
  </Form>
)
