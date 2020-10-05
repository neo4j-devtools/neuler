import React from "react";
import {getAlgorithmDefinitions, getAlgorithms} from "./algorithmsLibrary";
import {OpenCloseSection} from "./Form/OpenCloseSection";
import {Dropdown, Form} from "semantic-ui-react";
import {connect} from "react-redux";
import {selectAlgorithm, selectGroup} from "../ducks/algorithms";

const SelectAlgorithmView = ({currentAlgorithm, metadata}) => {
    const [selectedAlgorithm, setSelectedAlgorithm] = React.useState(null)

    React.useEffect(() => {
        console.log("currentAlgorithm", currentAlgorithm)
        setSelectedAlgorithm(currentAlgorithm)
    }, [])

    const handleChange = (e, {value}) => {
        setSelectedAlgorithm(value)
    }

    const algorithmDescriptions = getAlgorithms("Centralities").map(algorithm => {
        return {
            key: algorithm,
            value: algorithm,
            text: algorithm,
            description: getAlgorithmDefinitions("Centralities", algorithm, metadata.versions.gdsVersion).description
        }
    })
    console.log("selectedAlgorithm", selectedAlgorithm)
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
