import React from 'react'
import {ProjectedGraphWithNoWeights} from "../Form/ProjectedGraph";
import {ResultsFilteringWrapper} from "../Form/ResultsFiltering";

const AlgoForm = ({onChange, relationshipType, label, direction, labelOptions, relationshipTypeOptions, relationshipOrientationOptions, children}) => {
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
    <ResultsFilteringWrapper>{children}</ResultsFilteringWrapper>
  </React.Fragment>
}

export default AlgoForm