import React from "react";
import {algorithmGroups, getAlgorithmDefinitions, getAlgorithms, getGroup} from "./algorithmsLibrary";
import {OpenCloseSection} from "./Form/OpenCloseSection";
import {Dropdown, Form, Header, Icon, Card, Divider} from "semantic-ui-react";
import {connect} from "react-redux";
import {selectAlgorithm, selectGroup} from "../ducks/algorithms";

const SelectAlgorithmView = ({currentAlgorithm, metadata, selectAlgorithm, selectGroup}) => {
    const [selectedAlgorithm, setSelectedAlgorithm] = React.useState(null)
    const [selectingAlgorithm, setSelectingAlgorithm] = React.useState(false)

    React.useEffect(() => {
        setSelectedAlgorithm(currentAlgorithm)
    }, [])

    const handleChange = (e, {value}) => {
        const group = getGroup(value);
        selectGroup(group)
        selectAlgorithm(value)
        setSelectedAlgorithm(value)
    }

    const allAlgorithms = {}
    Object.keys(algorithmGroups).forEach(group => {
        getAlgorithms(group).forEach(algorithm => {
            allAlgorithms[algorithm] = {
                description: getAlgorithmDefinitions(group, algorithm, metadata.versions.gdsVersion).description,
                group: group
            }
        })
    })

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

    return (selectedAlgorithm &&
        <OpenCloseSection title="Algorithm">
            <div style={{border: "1px solid rgba(34,36,38,.15)", borderRadius: "7px", padding: "10px 0 0 10px"}}>
                <div style={{display: "flex", cursor: "pointer" ,justifyContent: "space-between"}} onClick={() => setSelectingAlgorithm(!selectingAlgorithm)}>
                <Header as="h3">
                    {selectedAlgorithm}
                    <Header.Subheader>
                        {allAlgorithms[selectedAlgorithm].description}
                    </Header.Subheader>
                </Header>
                <Icon name={selectingAlgorithm ? 'triangle up big' : 'triangle down big'}/>
                </div>

                <div style={selectingAlgorithm ? {display: ''} : {display: 'none'}} className="algorithm-groups">
                    {Object.keys(algorithmGroups).map(group => <div key={group} className="algorithm-group-container">
                        <div className="algorithm-group">
                            <span>{group}</span>
                        </div>
                        <Card.Group className="small-cards" items={getAlgorithms(group).map(algorithm => {return {
                            description: algorithm,
                            className: selectedAlgorithm === algorithm ? "selected" : "",
                            "onClick": (event, {description}) => handleChange(event, {value: description})
                        }})} />
                    </div>)

                    }
                </div>

            </div>



        </OpenCloseSection>)


    // return <OpenCloseSection title="Algorithm">
    //     <Form>
    //         <Form.Field>
    //             <Dropdown search selection options={algorithmDescriptions} value={selectedAlgorithm} fluid
    //                       onChange={handleChange}
    //             />
    //         </Form.Field>
    //     </Form>
    // </OpenCloseSection>

}
export default connect(state => ({
    metadata: state.metadata,
}), dispatch => ({
    selectAlgorithm: algorithm => dispatch(selectAlgorithm(algorithm)),
    selectGroup: algorithm => dispatch(selectGroup(algorithm)),
}))(SelectAlgorithmView)
