import React from 'react'
import {Checkbox, Divider, Form, Input, Label, Segment} from "semantic-ui-react";
import {OpenCloseSection} from "./OpenCloseSection";

export const StorePropertyAndRelationshipType = ({persist, onChange, writeProperty, writeRelationshipType, readOnly, children}) => {
    return <OpenCloseSection title="Results">
        <Form.Field inline style={{display: "flex", "align-items": "center"}}
                    className={readOnly ? "disabled" : null}>
            <label style={{'width': '12em'}}>Store results?</label>
            <Checkbox toggle checked={persist} onChange={(evt, data) => {
                onChange('persist', data.checked)
            }}/>

        </Form.Field>
        {
            persist ?
                <Form.Field inline className={readOnly ? "disabled" : null}>
                    <label style={{'width': '12em'}}>Write Property</label>
                    <Input basic="true" value={writeProperty} placeholder='Write Property'
                           onChange={evt => onChange('writeProperty', evt.target.value)}/>
                </Form.Field>
                : null
        }
        {
            persist ?
                <Form.Field inline className={readOnly ? "disabled" : null}>
                    <label style={{'width': '12em'}}>Write Relationship Type</label>
                    <Input basic="true" value={writeRelationshipType} placeholder='Write Relationship Type'
                           onChange={evt => onChange('writeRelationshipType', evt.target.value)}/>
                </Form.Field>
                : null
        }
        <Divider />
        {children}
    </OpenCloseSection>
}