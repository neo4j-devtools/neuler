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
        const group = getGroup(value, metadata.versions.gdsVersion);
        selectGroup(group, metadata.versions.gdsVersion)
        selectAlgorithm(value)
        setSelectedAlgorithm(value)
    }

    const allAlgorithms = {}
    Object.keys(algorithmGroups).forEach(group => {
        getAlgorithms(group, metadata.versions.gdsVersion).forEach(algorithm => {
            allAlgorithms[algorithm] = {
                description: getAlgorithmDefinitions(group, algorithm, metadata.versions.gdsVersion).description,
                group: group
            }
        })
    })

    return (selectedAlgorithm &&
        <OpenCloseSection title="Algorithm">
            <div style={{border: "1px solid rgba(34,36,38,.15)", borderRadius: ".28571429rem", padding: "10px 0 0 10px"}}>
                <div style={{display: "flex", cursor: "pointer" ,justifyContent: "space-between"}} onClick={() => setSelectingAlgorithm(!selectingAlgorithm)}>
                <Header as="h3">
                    {selectedAlgorithm}
                    <Header.Subheader>
                        {allAlgorithms[selectedAlgorithm].description}
                    </Header.Subheader>
                </Header>
                <Icon name={selectingAlgorithm ? 'triangle up' : 'triangle down'} size="big"/>
                </div>

                <div style={selectingAlgorithm ? {display: ''} : {display: 'none'}} className="algorithm-groups">
                    {Object.keys(algorithmGroups).map(group => <div key={group} className="algorithm-group-container">
                        <div className="algorithm-group">
                            <span>{group}</span>
                        </div>
                        <Card.Group className="small-cards" items={getAlgorithms(group, metadata.versions.gdsVersion).map(algorithm => {return {
                            description: algorithm,
                            className: selectedAlgorithm === algorithm ? "selected" : "",
                            "onClick": (event, {description}) => handleChange(event, {value: description})
                        }})} />
                    </div>)
                    }
                </div>
            </div>
        </OpenCloseSection>)
}
export default connect(state => ({
    metadata: state.metadata,
}), dispatch => ({
    selectAlgorithm: algorithm => dispatch(selectAlgorithm(algorithm)),
    selectGroup: (algorithm, gdsVersion) => dispatch(selectGroup(algorithm, gdsVersion)),
}))(SelectAlgorithmView)
