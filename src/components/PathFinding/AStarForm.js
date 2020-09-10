import React from 'react'
import {Form, Input, Label, Popup, Segment} from "semantic-ui-react"
import {ProjectedGraphWithWeights} from "../Form/ProjectedGraph";
import {ResultsFilteringWrapper} from "../Form/ResultsFiltering";

const AlgoForm = ({
                      children, readOnly, onChange, relationshipType, labelOptions, label, propertyKeyOptions, relationshipTypeOptions,
                      relationshipOrientationOptions, startNode, endNode, weightProperty, defaultValue, propertyKeyLat, propertyKeyLon, direction, persist
                  }) => {
    const projectedGraphProps = {
        label,
        labelOptions,
        relationshipType,
        direction,
        relationshipTypeOptions,
        relationshipOrientationOptions,
        propertyKeyOptions,
        weightProperty,
        defaultValue,
        onChange,
        readOnly
    }
    return (
        <Form size='mini' style={{marginBottom: '1em'}}>
            <ProjectedGraphWithWeights {...projectedGraphProps} />
            <Parameters onChange={onChange}
                        startNode={startNode} endNode={endNode}
                        propertyKeyLat={propertyKeyLat} propertyKeyLon={propertyKeyLon}
                        readOnly={readOnly}
            />
            <ResultsFilteringWrapper>{children}</ResultsFilteringWrapper>
        </Form>
    )
}

const Parameters = ({onChange, startNode, endNode, propertyKeyLat, propertyKeyLon, readOnly}) => {
    return <Segment>
        <Label as='a' attached='top left'>
            Algorithm Parameters
        </Label>
        <Form.Group inline className={readOnly ? "disabled" : null}>
            <label style={{'width': '12em'}}>Start Node</label>
            <Form.Field inline>
                <Popup size="tiny"
                       trigger={<Input basic="true" value={startNode} placeholder='Start Node'
                                       onChange={evt => onChange('startNode', evt.target.value)}/>}
                       content='Populate this field with the value of any property on any node'/>
            </Form.Field>
        </Form.Group>
        <Form.Group inline className={readOnly ? "disabled" : null}>
            <label style={{'width': '12em'}}>End Node</label>
            <Form.Field inline>
                <Popup size="tiny" trigger={<Input basic="true" value={endNode} placeholder='End Node'
                                                   onChange={evt => onChange('endNode', evt.target.value)}/>}
                       content='Populate this field with the value of any property on any node'/>
            </Form.Field>
        </Form.Group>


        <Form.Field inline className={readOnly ? "disabled" : null}>
            <label style={{'width': '12em'}}>Property Key Lat</label>
            <input
                value={propertyKeyLat}
                onChange={evt => onChange('propertyKeyLat', evt.target.value)}
                style={{'width': '7em'}}
            />
        </Form.Field>
        <Form.Field inline className={readOnly ? "disabled" : null}>
            <label style={{'width': '12em'}}>Property Key Lon</label>
            <input size='mini'
                   value={propertyKeyLon}
                   onChange={evt => onChange('propertyKeyLon', evt.target.value)}

            />
        </Form.Field>
    </Segment>
}

export default AlgoForm
