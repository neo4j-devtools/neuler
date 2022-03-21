import React from "react"
import { Form, Label, Segment, Dropdown } from "semantic-ui-react"
import { ProjectedGraphWithNoWeights } from "../Form/ProjectedGraph"
import { StorePropertyAndRelationshipType } from "../Form/StorePropertyAndRelationshipType"

const AlgoForm = ({
	onChange,
	readOnly,
	relationshipType,
	label,
	children,
	propertyKeyOptions,
	labelOptions,
	relationshipOrientationOptions,
	relationshipTypeOptions,
	writeProperty,
	writeRelationshipType,
	similarityCutoff,
	degreeCutoff,
	direction,
	persist,
	similarityMetric
}) => {
	const projectedGraphProps = {
		label,
		labelOptions,
		relationshipType,
		direction,
		relationshipTypeOptions,
		relationshipOrientationOptions,
		onChange,
		readOnly,
		similarityMetric
	}

	const [open, setOpen] = React.useState(true)
	const style = { display: open ? "" : "none" }

	const similarityMetricOptions = ["Jaccard", "Overlap"].map(el => ({
		key: el,
		text: el,
		value: el
	}))

	return (
		<Form size="mini" style={{ marginBottom: "1em" }}>
			<ProjectedGraphWithNoWeights {...projectedGraphProps} />
			<Segment>
				<Label as="a" attached="top left" onClick={() => setOpen(!open)}>
					Algorithm Parameters
				</Label>
				<Form style={style}>
					<Form.Field inline className={readOnly ? "disabled" : null}>
						<label style={{ width: "12em" }}>Similarity Metric</label>
						<Dropdown
							disabled={readOnly}
							placeholder="Similarity Metric"
							value={similarityMetric}
							search
							selection
							options={similarityMetricOptions}
							onChange={(evt, data) => onChange("similarityMetric", data.value)}
						/>
					</Form.Field>
					<Form.Field inline className={readOnly ? "disabled" : null}>
						<label style={{ width: "12em" }}>Similarity Cutoff</label>
						<input
							value={similarityCutoff}
							onChange={evt => onChange("similarityCutoff", evt.target.value)}
							style={{ width: "7em" }}
						/>
					</Form.Field>
					<Form.Field inline className={readOnly ? "disabled" : null}>
						<label style={{ width: "12em" }}>Degree Cutoff</label>
						<input
							value={degreeCutoff}
							onChange={evt => onChange("degreeCutoff", evt.target.value)}
							style={{ width: "7em" }}
						/>
					</Form.Field>
				</Form>
			</Segment>
			<StorePropertyAndRelationshipType
				persist={persist}
				onChange={onChange}
				writeProperty={writeProperty}
				writeRelationshipType={writeRelationshipType}
				readOnly={readOnly}
			>
				{children}
			</StorePropertyAndRelationshipType>
		</Form>
	)
}

export default AlgoForm
