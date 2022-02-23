import React from 'react'
import {Form, Input, Popup} from "semantic-ui-react"
import {ProjectedGraphWithWeights} from "../Form/ProjectedGraph";
import {ResultsFilteringWrapper} from "../Form/ResultsFiltering";
import {OpenCloseSection} from "../Form/OpenCloseSection";

const AlgoForm = ({
                      children, onChange, readOnly, relationshipType, label, relationshipOrientationOptions,
                      propertyKeyOptions, labelOptions, relationshipTypeOptions, startNode, weightProperty, 
                      defaultValue, direction, persist, relPropertyKeyOptions
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
        readOnly,
        relPropertyKeyOptions
    }

    return (
        <Form size='mini' style={{marginBottom: '1em'}}>

            <ProjectedGraphWithWeights {...projectedGraphProps} />

            <Parameters startNode={startNode} onChange={onChange} readOnly={readOnly}/>

            <ResultsFilteringWrapper>{children}</ResultsFilteringWrapper>
        </Form>
    )
}

const Parameters = ({onChange, startNode, readOnly}) => {
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
    </OpenCloseSection>
}

export default AlgoForm