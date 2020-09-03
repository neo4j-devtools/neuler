import {connect} from "react-redux";
import React from "react";

const getNested = (obj, ...args) => {
    return args.reduce((obj, level) => obj && obj[level], obj)
}

export const generateCellStyle = (labels, labelBackgrounds) => {
    let style = {
        maxWidth: '40em',
        overflow: 'hidden',
        cursor: "pointer"
    };

    let [label] = labels;
    style.background = getNested(labelBackgrounds, label, "color") || "#efefef"
    return style;
}

const NodeLabelView = ({labels, globalLabels, caption, metadata}) => {
    const labelBackgrounds = globalLabels[metadata.activeDatabase]
    return <span key={caption}  style={generateCellStyle(labels, labelBackgrounds)} className="label">{caption}</span>
}

export default connect(state => ({
    globalLabels: state.settings.labels,
    metadata: state.metadata,
}))(NodeLabelView)
