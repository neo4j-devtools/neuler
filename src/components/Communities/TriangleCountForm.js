import React, {Component} from 'react'
import {Form, Label, Input} from "semantic-ui-react"
import CommunityForm from './CommunityForm'

export default class extends Component {
    state = {
        advanced: false
    }

    render() {
        const {onChange, labelOptions, relationshipTypeOptions, weightProperty, clusteringCoefficientProperty, writeProperty, defaultValue, concurrency, direction, persist} = this.props

        return (
            <Form size='mini' style={{marginBottom: '1em'}}>
                <CommunityForm onChange={onChange} direction={direction} persist={persist} writeProperty={writeProperty}
                               concurrency={concurrency} labelOptions={labelOptions}
                               relationshipTypeOptions={relationshipTypeOptions}/>
                <Form.Field inline>

                    <label style={{'width': '8em'}}>Clustering Coefficient Property</label>
                    <input
                        value={clusteringCoefficientProperty}
                        onChange={evt => onChange('clusteringCoefficientProperty', evt.target.value)}
                        style={{'width': '10em'}}
                    />
                </Form.Field>
            </Form>
        )
    }
}
