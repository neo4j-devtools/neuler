import React from "react";
import {algorithmGroups, getAlgorithmDefinitions, getAlgorithms, getGroup} from "./algorithmsLibrary";
import {OpenCloseSection} from "./Form/OpenCloseSection";
import {Dropdown, Form} from "semantic-ui-react";
import {connect} from "react-redux";
import {selectAlgorithm, selectGroup} from "../ducks/algorithms";

const SelectAlgorithmView = ({currentAlgorithm, metadata, selectAlgorithm, selectGroup}) => {
    const [selectedAlgorithm, setSelectedAlgorithm] = React.useState(null)

    React.useEffect(() => {
        setSelectedAlgorithm(currentAlgorithm)
    }, [])

    const handleChange = (e, {value}) => {
        const group = getGroup(value);
        selectGroup(group)
        selectAlgorithm(value)
        setSelectedAlgorithm(value)
    }

    const algorithmDescriptions= Object.keys(algorithmGroups).flatMap(group => {
        return getAlgorithms(group).map(algorithm => {
            return {
                key: algorithm,
                value: algorithm,
                text: algorithm,
                description: getAlgorithmDefinitions(group, algorithm, metadata.versions.gdsVersion).description
            }
        })
    })

    return <OpenCloseSection title="Algorithm">
        <Form>
            <Form.Field>
                <Dropdown search selection options={algorithmDescriptions} value={selectedAlgorithm} fluid
                          onChange={handleChange}
                />
            </Form.Field>
        </Form>
    </OpenCloseSection>

}
export default connect(state => ({
    metadata: state.metadata,
}), dispatch => ({
    selectAlgorithm: algorithm => dispatch(selectAlgorithm(algorithm)),
    selectGroup: algorithm => dispatch(selectGroup(algorithm)),
}))(SelectAlgorithmView)
