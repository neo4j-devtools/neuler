import React from 'react'
import {ProjectedGraphWithNoWeights} from "../Form/ProjectedGraph";
import {ResultsStorage} from "../Form/ResultsStorage";

const AlgoForm =  ({onChange, label, relationshipType, direction, persist, writeProperty, labelOptions, relationshipTypeOptions, relationshipOrientationOptions}) => {
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
    <ResultsStorage persist={persist} onChange={onChange} writeProperty={writeProperty}/>
  </React.Fragment>
}

export default AlgoForm