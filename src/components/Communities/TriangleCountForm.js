import React, {Component} from 'react'
import {Form, Label, Input} from "semantic-ui-react"
import CommunityForm from './CommunityForm'

export default class extends Component {
    state = {
      advanced: false,
      relationshipOrientationOptions: [{ key: "Undirected", value: "Undirected", text: 'Undirected' }]
    }

    render() {
        const {onChange, labelOptions, relationshipType, relationshipTypeOptions, weightProperty, clusteringCoefficientProperty, writeProperty, defaultValue, concurrency, direction, persist} = this.props

        return (
            <Form size='mini' style={{marginBottom: '1em'}}>
                <CommunityForm onChange={onChange} direction={direction} persist={persist} writeProperty={writeProperty}
                               concurrency={concurrency} labelOptions={labelOptions}
                               relationshipType={relationshipType} relationshipOrientationOptions={this.state.relationshipOrientationOptions}
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
