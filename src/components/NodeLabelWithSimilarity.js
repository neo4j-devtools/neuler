import {connect} from "react-redux";
import React from "react";


const getNested = (obj, ...args) => {
    return args.reduce((obj, level) => obj && obj[level], obj)
}

export const generateCellStyle = (style, labels, labelBackgrounds) => {
    let [label] = labels;
    style.background = getNested(labelBackgrounds, label, "color") || "#efefef"
    return style;
}

const NodeLabelWithSimilarity = ({labels, database, globalLabels, caption, similarity}) => {
    const labelBackgrounds = globalLabels[database]
    let readOnlyStyle = {
        maxWidth: '40em',
        overflow: 'hidden',
    };

    return <React.Fragment>
        <span title={labels}
              style={generateCellStyle(readOnlyStyle, labels, labelBackgrounds)}
              className="label left">
        {caption}
    </span>
        <span
            className="label right"
            style={{maxWidth: '40em', overflow: 'hidden', background: '#EFEFEF'}}>
            {similarity}
        </span>
    </React.Fragment>


}

export default connect(state => ({
    globalLabels: state.metadata.allLabels,
    metadata: state.metadata,
}))(NodeLabelWithSimilarity)
