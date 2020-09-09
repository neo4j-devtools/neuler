import React from 'react'
import {Checkbox, Form, Input, Label, Segment} from "semantic-ui-react";

export const ResultsStorage = ({persist, onChange, writeProperty}) => {
    return <Segment key={persist}>
        <Label as='a' attached='top left'>
            Store Results
        </Label>

        <Form.Field inline style={{  display: "flex", "align-items": "center"}}>
            <label style={{'width': '12em'}}>Store results?</label>
            <Checkbox toggle checked={persist} onChange={(evt, data) => {
                onChange('persist', data.checked)
            }}/>

        </Form.Field>
        {
            persist ?
                <Form.Field inline>
                    <label style={{'width': '12em'}}>Write Property</label>
                    <Input basic="true" value={writeProperty} placeholder='Write Property'
                           onChange={evt => onChange('writeProperty', evt.target.value)}/>
                </Form.Field>
                : null
        }

    </Segment>
}