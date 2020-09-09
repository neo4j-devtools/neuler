import React from 'react'
import {Dropdown, Form} from "semantic-ui-react"
import {ProjectedGraphWithNoWeights} from "../Form/ProjectedGraph";

const AlgoForm = ({onChange, relationshipType, label, direction, persist, labelOptions, relationshipTypeOptions, relationshipOrientationOptions}) => {
  const projectedGraphProps = {
    label,
    labelOptions,
    relationshipType,
    direction,
    relationshipTypeOptions,
    relationshipOrientationOptions,
    onChange
  }

  return <React.Fragment>
    <ProjectedGraphWithNoWeights {...projectedGraphProps} />

  </React.Fragment>
}

export default AlgoForm
