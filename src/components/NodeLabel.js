import {connect} from "react-redux";
import React from "react";
import UpdateNodeLabel from "./Onboarding/UpdateNodeLabel";

const randomColor = require('randomcolor');
const tenOf = (color) => {
    return randomColor({
        count: 10,
        hue: color,
        luminosity: 'light',
    });
}

const colors = tenOf("green").concat(tenOf("blue")).concat(tenOf("orange")).concat(tenOf("red")).concat(tenOf("yellow"));

export const selectCaption = (propertyKeys) => {
    if (!propertyKeys) {
        return [];
    }

    const favouredCaptions = ["name", "title", "id", "value"]
    return favouredCaptions.filter(key => propertyKeys.includes(key)) || propertyKeys[Math.floor(Math.random() * propertyKeys.length)]
}

export const selectRandomColor = () => {
    return colors[Math.floor(Math.random() * 50)]
}

const getNested = (obj, ...args) => {
    return args.reduce((obj, level) => obj && obj[level], obj)
}

export const generateCellStyle = (style, labels, labelBackgrounds) => {
    let [label] = labels;
    style.background = getNested(labelBackgrounds, label, "color") || "#efefef"
    return style;
}

const NodeLabel = ({labels, database, globalLabels, caption, metadata, readOnly}) => {
    const [open, setOpen] = React.useState(false)
    let [label] = labels;

    const labelBackgrounds = globalLabels[database]

    let style = {
        maxWidth: '40em',
        overflow: 'hidden',
        cursor: "pointer"
    };

    let readOnlyStyle = {
        maxWidth: '40em',
        overflow: 'hidden',
    };

    return readOnly ? <div>
        <span style={generateCellStyle(readOnlyStyle, labels, labelBackgrounds)}
              className="label">
        {caption}
    </span>
        </div>
        : <div>
        <span onClick={() => setOpen(!open)} key={caption} style={generateCellStyle(style, labels, labelBackgrounds)}
              className="label">
        {caption}
    </span>
            <UpdateNodeLabel database={database} open={open} setOpen={setOpen} label={label}/>
        </div>

}

export default connect(state => ({
    globalLabels: state.settings.labels,
    metadata: state.metadata,
}))(NodeLabel)
