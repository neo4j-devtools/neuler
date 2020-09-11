import React from 'react'
import {Checkbox, Divider, Form, Input, Label, Segment} from "semantic-ui-react";
import {OpenCloseSection} from "./OpenCloseSection";

export const StoreProperty = ({persist, onChange, writeProperty, readOnly, children}) => {
    return <OpenCloseSection title="Results">
        <Form.Field className={readOnly ? "disabled" : null} inline style={{display: "flex", alignItems: "center"}}>
            <label style={{'width': '12em'}}>Store results?</label>
            <Checkbox disabled={readOnly} toggle checked={persist} onChange={(evt, data) => {
                onChange('persist', data.checked)
            }}/>

        </Form.Field>
        {
            persist ?
                <Form.Field inline className={readOnly ? "disabled" : null}>
                    <label style={{'width': '12em'}}>Write Property</label>
                    <Input disabled={readOnly} basic="true" value={writeProperty} placeholder='Write Property'
                           onChange={evt => onChange('writeProperty', evt.target.value)}/>
                </Form.Field>
                : null
        }
        <Divider />
        {children}
    </OpenCloseSection>
}