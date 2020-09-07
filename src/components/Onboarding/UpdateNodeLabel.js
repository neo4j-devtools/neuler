import {Modal, Button, Message, Checkbox, Grid} from "semantic-ui-react";
import React from "react";
import {connect} from "react-redux";
import {selectGroup} from "../../ducks/algorithms";
import {SketchPicker} from 'react-color';
import reactCSS from 'reactcss'
import {updateLabelColor, updateLabelPropertyKeys} from "../../ducks/settings";
import NodeLabel from "../NodeLabel";

const UpdateNodeLabel = ({updateLabelColor, metadata, database, open, setOpen, label, globalLabels}) => {
    const [displayColorPicker, setDisplayColorPicker] = React.useState(false)

    const nodeLabel = globalLabels[database][label]
    const [color, setColor] = React.useState(nodeLabel.color)

    const styles = reactCSS({
        'default': {
            color: {
                width: '36px',
                height: '14px',
                borderRadius: '2px',
                background: `${color}`,
            },
            swatch: {
                position: "absolute",
                padding: '5px',
                background: '#fff',
                borderRadius: '1px',
                boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                display: 'inline-block',
                cursor: 'pointer',
                left: "100px",
                top: "22px"
            },
            popover: {
                position: 'absolute',
                zIndex: '2',
                left: "150px",
                top: "22px"
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
        <Modal.Content style={{height: "500px", position: "relative"}}>
            <div>
                <div className="update-node-row">
                    <div><p>Color:</p></div>
                    <div>
                        <div style={styles.swatch} onClick={() => setDisplayColorPicker(true)}>
                            <div style={styles.color}/>
                        </div>
                        {displayColorPicker ? <div style={styles.popover}>
                            <div style={styles.cover} onClick={() => setDisplayColorPicker(false)}/>
                            <SketchPicker
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
                <div className="update-node-row">
                    <div><p>Captions:</p></div>
                    <SelectCaption database={database} label={label} />
                </div>

            </div>
        </Modal.Content>
    </Modal>
}

const SelectCaptionView = ({metadata, globalLabels, database, label,updateLabelPropertyKeys}) => {
    const nodeLabel = globalLabels[database][label]
    const [selectedPropertyKeys, setSelectedPropertyKeys]  = React.useState(nodeLabel.propertyKeys)

    return <div key={selectedPropertyKeys}>
        <Grid columns={3}>
            {metadata.nodePropertyKeys[label].map(key =>
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

const SelectCaption = connect(state => ({metadata: state.metadata, globalLabels: state.settings.labels}), dispatch => ({
        updateLabelPropertyKeys: (database, label, propertyKeys) => dispatch(updateLabelPropertyKeys(database, label, propertyKeys))
    })
)(SelectCaptionView)

const mapStateToProps = state => ({
    globalLabels: state.settings.labels,
    metadata: state.metadata
})

const mapDispatchToProps = dispatch => ({
    selectGroup: group => dispatch(selectGroup(group)),
    updateLabelColor: (database, label, color) => dispatch(updateLabelColor(database, label, color)),
    updateLabelPropertyKeys: (database, label, propertyKeys) => dispatch(updateLabelPropertyKeys(database, label, propertyKeys))
})

export default connect(mapStateToProps, mapDispatchToProps)(UpdateNodeLabel)