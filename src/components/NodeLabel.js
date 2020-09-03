import {connect} from "react-redux";
import React from "react";

const randomColor = require('randomcolor');
const tenOf = (color) => {
    return randomColor({
        count: 10,
        hue: color,
        luminosity: 'light',
    });
}

const colors = tenOf("green").concat(tenOf("blue")).concat(tenOf("orange")).concat(tenOf("red")).concat(tenOf("yellow"));

export const selectRandomColor = () => {
    return colors[Math.floor(Math.random() * 50)]
}

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
