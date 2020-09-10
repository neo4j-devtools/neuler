import React from 'react'
import {ProjectedGraphWithNoWeights} from "../Form/ProjectedGraph";
import {ResultsFilteringWrapper} from "../Form/ResultsFiltering";

const AlgoForm = ({onChange, readOnly, relationshipType, label, direction, persist, labelOptions, relationshipTypeOptions, relationshipOrientationOptions, children}) => {
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

  return <React.Fragment>
    <ProjectedGraphWithNoWeights {...projectedGraphProps} />
    <ResultsFilteringWrapper>{children}</ResultsFilteringWrapper>
  </React.Fragment>
}


export default AlgoForm
