import {Modal, Button, Message} from "semantic-ui-react";
import React from "react";
import {connect} from "react-redux";
import {selectGroup} from "../../ducks/algorithms";
import {SketchPicker} from 'react-color';
import reactCSS from 'reactcss'

const UpdateNodeLabel = ({metadata, selectGroup, open, setOpen, label, globalLabels}) => {
    const [displayColorPicker, setDisplayColorPicker] = React.useState(false)

    const nodeLabel = globalLabels[metadata.activeDatabase][label]
    const [color, setColor] = React.useState(nodeLabel.color)

    const styles = reactCSS({
        'default': {
            color: {
                width: '36px',
                height: '14px',
                borderRadius: '2px',
                background: `${nodeLabel.color}`,
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
                  onClose={() => setOpen(false)}
                  onOpen={() => setOpen(true)}
                  centered={false}
                  closeIcon
                  closeOnDimmerClick={false}
                  closeOnDocumentClick={false}
                  dimmer={false}
                  size="small">
        <Modal.Header>
            Update {label}
        </Modal.Header>
        <Modal.Content>
            <div>
                <p>
                    Color: <div>
                    <div style={styles.swatch} onClick={() => setDisplayColorPicker(true)}>
                        <div style={styles.color}/>
                    </div>
                    {displayColorPicker ? <div style={styles.popover}>
                        <div style={styles.cover} onClick={() => setDisplayColorPicker(false)}/>
                        <SketchPicker color={color} onChange={(c) => () => setColor(c)}/>
                    </div> : null}

                </div>
                </p>
                <p>
                    Captions: {nodeLabel.propertyKeys}
                </p>
                <p>

                </p>
            </div>
        </Modal.Content>
    </Modal>
}

const mapStateToProps = state => ({
    globalLabels: state.settings.labels,
    metadata: state.metadata
})

const mapDispatchToProps = dispatch => ({
    selectGroup: group => dispatch(selectGroup(group))
})

export default connect(mapStateToProps, mapDispatchToProps)(UpdateNodeLabel)