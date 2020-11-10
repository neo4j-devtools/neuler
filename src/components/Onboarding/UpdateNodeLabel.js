import {Checkbox, Divider, Grid, Modal} from "semantic-ui-react";
import React from "react";
import {connect} from "react-redux";
import {selectGroup} from "../../ducks/algorithms";
import {SketchPicker} from 'react-color';
import reactCSS from 'reactcss'
import {updateLabelColor, updateLabelPropertyKeys} from "../../ducks/metadata";

export const getNodeLabel = (globalLabels, database, label) => {
    const nodeLabel = globalLabels[database][label];
    return nodeLabel ? nodeLabel : {color: "#efefef", propertyKeys: []};
}

const UpdateNodeLabel = ({updateLabelColor, metadata, database, open, setOpen, label, globalLabels}) => {
    const [displayColorPicker, setDisplayColorPicker] = React.useState(false)

    const nodeLabel = getNodeLabel(globalLabels, database, label)
    const [color, setColor] = React.useState(null)

    React.useEffect(() => {
        setColor(nodeLabel.color)
    }, [nodeLabel.color])

    const styles = reactCSS({
        'default': {
            color: {
                width: '36px',
                height: '14px',
                borderRadius: '2px',
                background: `${color}`,
            },
            swatch: {

                padding: '5px',
                background: '#fff',
                borderRadius: '1px',
                boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                display: 'inline-block',
                cursor: 'pointer',

            },
            popover: {
                position: 'absolute',
                zIndex: '2',
            },
            cover: {
                position: 'fixed',
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px',
            },
        },
    });

    return <Modal open={open}
                  onClose={() => {
                      setOpen(false);
                      setDisplayColorPicker(false)
                  }}
                  onOpen={() => setOpen(true)}
                  centered={false}
                  closeIcon
                  size="small">
        <Modal.Header>
            Update {label}
        </Modal.Header>
        <Modal.Content >
            <div key={color}>
                <div className="update-node-row">
                    <h4>Color</h4>
                    <div>
                        <div style={styles.swatch} onClick={() => setDisplayColorPicker(true)}>
                            <div style={styles.color}/>
                        </div>
                        {displayColorPicker ? <div style={styles.popover}>
                            <div style={styles.cover} onClick={() => setDisplayColorPicker(false)}/>
                            <SketchPicker
                                disableAlpha={true}
                                color={color}
                                onChange={(c) => setColor(c.hex)}
                                onChangeComplete={(c) => {
                                    setColor(c.hex)
                                    updateLabelColor(database, label, c.hex)
                                }}
                            />
                        </div> : null}

                    </div>
                </div>
                <Divider />
                <div className="update-node-row">
                    <h4>Caption</h4>
                    <SelectCaption database={database} label={label} />
                </div>

            </div>
        </Modal.Content>
    </Modal>
}

const SelectCaptionView = ({metadata, globalLabels, database, label,updateLabelPropertyKeys}) => {
    const nodeLabel = getNodeLabel(globalLabels, database, label)
    const [selectedPropertyKeys, setSelectedPropertyKeys]  = React.useState(nodeLabel.propertyKeys)

    return <div key={selectedPropertyKeys}>
        <Grid columns={3}>
            {label in metadata.nodePropertyKeys && metadata.nodePropertyKeys[label].map(key =>
                <Grid.Column key={key}>
                    <Checkbox
                        name={key}
                        checked={selectedPropertyKeys.includes(key)}
                        onChange={(_, data) => {
                            if(data.checked) {
                                setSelectedPropertyKeys([...selectedPropertyKeys, data.name])
                                updateLabelPropertyKeys(database, label, [...selectedPropertyKeys, data.name])
                            } else {
                                setSelectedPropertyKeys(selectedPropertyKeys.filter(key => key !== data.name))
                                updateLabelPropertyKeys(database, label, selectedPropertyKeys.filter(key => key !== data.name))
                            }
                        }}

                        label={<label title={key}>{key}</label>}
                    />
                </Grid.Column>)}
        </Grid>
    </div>
}

const SelectCaption = connect(state => ({metadata: state.metadata, globalLabels: state.metadata.allLabels}), dispatch => ({
        updateLabelPropertyKeys: (database, label, propertyKeys) => dispatch(updateLabelPropertyKeys(database, label, propertyKeys))
    })
)(SelectCaptionView)

const mapStateToProps = state => ({
    globalLabels: state.metadata.allLabels,
    metadata: state.metadata
})

const mapDispatchToProps = dispatch => ({
    selectGroup: group => dispatch(selectGroup(group)),
    updateLabelColor: (database, label, color) => dispatch(updateLabelColor(database, label, color))
})

export default connect(mapStateToProps, mapDispatchToProps)(UpdateNodeLabel)
