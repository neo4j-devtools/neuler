import React from 'react'
import {Dropdown, Form, Input, Popup} from "semantic-ui-react"
import {ProjectedGraphWithWeights} from "../Form/ProjectedGraph";
import {ResultsFilteringWrapper} from "../Form/ResultsFiltering";
import {OpenCloseSection} from "../Form/OpenCloseSection";

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
                        readOnly={readOnly} propertyKeyOptions={propertyKeyOptions}
            />
            <ResultsFilteringWrapper>{children}</ResultsFilteringWrapper>
        </Form>
    )
}

const Parameters = ({onChange, startNode, endNode, propertyKeyLat, propertyKeyLon, readOnly, propertyKeyOptions}) => {
    return <OpenCloseSection title="Algorithm Parameters">
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
            <Dropdown disabled={readOnly} placeholder='Weight Property' value={propertyKeyLat}
                      search selection
                      options={propertyKeyOptions}
                      onChange={(evt, data) => onChange("propertyKeyLat", data.value)}/>
        </Form.Field>

        <Form.Field inline className={readOnly ? "disabled" : null}>
            <label style={{'width': '12em'}}>Property Key Lon</label>
            <Dropdown disabled={readOnly} placeholder='Weight Property' value={propertyKeyLon}
                      search selection
                      options={propertyKeyOptions}
                      onChange={(evt, data) => onChange("propertyKeyLon", data.value)}/>
        </Form.Field>

    </OpenCloseSection>
}

export default AlgoForm
