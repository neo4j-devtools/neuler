import React from 'react'
import {Checkbox, Form, Input, Label, Segment} from "semantic-ui-react";

export const ResultsStorage = ({persist, onChange, writeProperty}) => {
    return <Segment key={persist}>
        <Label as='a' attached='top left'>
            Store Results
        </Label>

        <Form.Field>
            <Checkbox toggle checked={persist} onChange={(evt, data) => {
                onChange('persist', data.checked)
            }}/>

        </Form.Field>
        {
            persist ?
                <Form.Field>
                    <label style={{'width': '8em'}}>Write Property</label>
                    <Input size='mini' basic="true" value={writeProperty} placeholder='Write Property'
                           onChange={evt => onChange('writeProperty', evt.target.value)}/>
                </Form.Field>
                : null
        }

    </Segment>
}