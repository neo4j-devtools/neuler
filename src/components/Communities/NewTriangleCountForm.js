import React, {Component} from 'react'
import {Form} from "semantic-ui-react"
import CommunityForm from './CommunityForm'

export default class extends Component {
    state = {
      advanced: false,
      relationshipOrientationOptions: [{ key: "Undirected", value: "Undirected", text: 'Undirected' }]
    }

    render() {
        const {onChange, labelOptions, relationshipType, relationshipTypeOptions, writeProperty, direction, persist} = this.props

        return (
            <Form size='mini' style={{marginBottom: '1em'}}>
                <CommunityForm onChange={onChange} direction={direction} persist={persist} writeProperty={writeProperty}
                                labelOptions={labelOptions}
                               relationshipType={relationshipType} relationshipOrientationOptions={this.state.relationshipOrientationOptions}
                               relationshipTypeOptions={relationshipTypeOptions}/>

            </Form>
        )
    }
}
