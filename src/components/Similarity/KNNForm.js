import React from 'react'
import {Dropdown, Form, Input, Label, Segment} from "semantic-ui-react"
import {ProjectedGraphWithNoWeights} from "../Form/ProjectedGraph";
import {StorePropertyAndRelationshipType} from "../Form/StorePropertyAndRelationshipType";
import {OpenCloseSection} from "../Form/OpenCloseSection";

const AlgoForm = ({onChange, readOnly, relationshipType, label, children, propertyKeyOptions, labelOptions, relationshipOrientationOptions, relationshipTypeOptions, writeProperty, writeRelationshipType, nodeWeightProperty, sampleRate, deltaThreshold, topK, randomJoins, direction, persist}) => {
    const projectedGraphProps = {
        label,
        labelOptions,
        relationshipType,
        direction,
        relationshipTypeOptions,
        relationshipOrientationOptions,
        onChange,
        readOnly
    }
    return (
        <Form size='mini' style={{marginBottom: '1em'}}>
            <ProjectedGraphWithNoWeights {...projectedGraphProps} />
            <Parameters onChange={onChange} readOnly={readOnly} propertyKeyOptions={propertyKeyOptions} nodeWeightProperty={nodeWeightProperty} sampleRate={sampleRate} topK={topK} deltaThreshold={deltaThreshold} randomJoins={randomJoins} />
            <StorePropertyAndRelationshipType persist={persist} onChange={onChange}
                                              writeProperty={writeProperty}
                                              writeRelationshipType={writeRelationshipType} readOnly={readOnly}
            >{children}</StorePropertyAndRelationshipType>
        </Form>
    )
}

const Parameters = ({onChange, readOnly, nodeWeightProperty, propertyKeyOptions, sampleRate, deltaThreshold, topK, randomJoins}) => {
    const [open, setOpen] = React.useState(true);
    const style = {display: open ? "" : "none"}

    return <Segment>
        <Label as='a' attached='top left' onClick={() => setOpen(!open)}>
            Algorithm Parameters
        </Label>


        <Form style={style}>

            <Form.Field disabled={readOnly} inline
                        label={<label style={{'width': '12em'}}># of neighbors per nodes</label>}
                        control={Input} type='number' value={topK}
                        onChange={(evt, data) => onChange('topK', data.value)} min={1} max={50} step={1}/>

            <Form.Field inline className={readOnly ? "disabled" : null}>
                <label style={{'width': '12em'}}>Node Weight Property</label>
                <Dropdown disabled={readOnly} placeholder='Weight Property' value={nodeWeightProperty}
                          search selection
                          options={propertyKeyOptions}
                          onChange={(evt, data) => onChange("nodeWeightProperty", data.value)}/>
            </Form.Field>

            <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>Sample Rate</label>}
                        control={Input} type='number' value={sampleRate} step={0.01}
                        onChange={(evt, data) => onChange('sampleRate', data.value)}/>

            <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>Delta Threshold</label>}
                        control={Input} type='number' value={deltaThreshold} step={0.01}
                        onChange={(evt, data) => onChange('deltaThreshold', data.value)}/>

            <Form.Field disabled={readOnly} inline
                        label={<label style={{'width': '12em'}}>Random Joins</label>}
                        control={Input} type='number' value={randomJoins}
                        onChange={(evt, data) => onChange('randomJoins', data.value)} min={1} max={50} step={1}/>

            {/*<Form.Field inline className={readOnly ? "disabled" : null}>*/}
            {/*    <label style={{'width': '12em'}}>Similarity Cutoff</label>*/}
            {/*    <input*/}
            {/*        value={similarityCutoff}*/}
            {/*        onChange={evt => onChange('similarityCutoff', evt.target.value)}*/}
            {/*        style={{'width': '7em'}}*/}
            {/*    />*/}
            {/*</Form.Field>*/}
            {/*<Form.Field inline className={readOnly ? "disabled" : null}>*/}
            {/*    <label style={{'width': '12em'}}>Degree Cutoff</label>*/}
            {/*    <input*/}
            {/*        value={degreeCutoff}*/}
            {/*        onChange={evt => onChange('degreeCutoff', evt.target.value)}*/}
            {/*        style={{'width': '7em'}}*/}
            {/*    />*/}
            {/*</Form.Field>*/}
        </Form>
    </Segment>
}

export default AlgoForm
