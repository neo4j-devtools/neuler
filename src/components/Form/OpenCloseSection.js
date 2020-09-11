import React from "react";
import {Form, Label, Segment} from "semantic-ui-react";

export const OpenCloseSection = ({title, children}) => {
    const [open, setOpen] = React.useState(true);
    const style = {display: open ? "" : "none"}

    return <Segment>
        <Label as='a' attached='top left' onClick={() => setOpen(!open)}>
            {title}
        </Label>
        <Form style={style}>
            {children}
        </Form>
    </Segment>
}