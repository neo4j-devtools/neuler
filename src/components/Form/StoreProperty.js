import React from 'react'
import {Checkbox, Form, Input, Label, Segment} from "semantic-ui-react";

export const StoreProperty = ({persist, onChange, writeProperty, readOnly}) => {
    return <Segment key={persist}>
        <Label as='a' attached='top left'>
            Store Results
        </Label>

        <Form.Field inline style={{  display: "flex", alignItems: "center"}}>
            <label style={{'width': '12em'}}>Store results?</label>
            <Checkbox disabled={readOnly} toggle checked={persist} onChange={(evt, data) => {
                onChange('persist', data.checked)
            }}/>

        </Form.Field>
        {
            persist ?
                <Form.Field inline>
                    <label style={{'width': '12em'}}>Write Property</label>
                    <Input disabled={readOnly} basic="true" value={writeProperty} placeholder='Write Property'
                           onChange={evt => onChange('writeProperty', evt.target.value)}/>
                </Form.Field>
                : null
        }

    </Segment>
}