import React, {Component} from 'react'
import {Dropdown, Form, Input, Label, Popup, Segment} from "semantic-ui-react"
import {ProjectedGraphWithNoWeights, ProjectedGraphWithWeights} from "../Form/ProjectedGraph";
import {StorePropertyAndRelationshipType} from "../Form/StorePropertyAndRelationshipType";

const AlgoForm = ({onChange, relationshipType, label, propertyKeyOptions, labelOptions, relationshipOrientationOptions, relationshipTypeOptions, writeProperty, writeRelationshipType, similarityCutoff, degreeCutoff, direction, persist}) => {
    const projectedGraphProps = {
        label,
        labelOptions,
        relationshipType,
        direction,
        relationshipTypeOptions,
        relationshipOrientationOptions,
        onChange
    }
    return (
        <Form size='mini' style={{marginBottom: '1em'}}>
            <ProjectedGraphWithNoWeights {...projectedGraphProps} />
            <Parameters onChange={onChange} similarityCutoff={similarityCutoff} degreeCutoff={degreeCutoff} />
            <StorePropertyAndRelationshipType persist={persist} onChange={onChange}
                                              writeProperty={writeProperty}
                                              writeRelationshipType={writeRelationshipType}
            />



        </Form>
    )
}

const Parameters = ({onChange, similarityCutoff, degreeCutoff}) => {
    return <Segment>
        <Label as='a' attached='top left'>
            Algorithm Parameters
        </Label>
        <Form.Field inline>

            <label style={{'width': '12em'}}>Similarity Cutoff</label>
            <input
                value={similarityCutoff}
                onChange={evt => onChange('similarityCutoff', evt.target.value)}
                style={{'width': '7em'}}
            />
        </Form.Field>
        <Form.Field inline>
            <label style={{'width': '12em'}}>Degree Cutoff</label>
            <input
                value={degreeCutoff}
                onChange={evt => onChange('degreeCutoff', evt.target.value)}
                style={{'width': '7em'}}
            />
        </Form.Field>
    </Segment>
}

export default AlgoForm