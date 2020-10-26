import React from "react";
import {Label, Segment} from "semantic-ui-react";

export const OpenCloseSection = ({title, children, className}) => {
    const [open, setOpen] = React.useState(true);
    const style = {display: open ? "" : "none"}

    return <Segment className={className || ""}>
        <Label as='a' attached='top left' onClick={() => setOpen(!open)}>
            {title}
        </Label>
        <div style={style}>
            {children}
        </div>
    </Segment>
}
