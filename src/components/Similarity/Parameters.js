import {Form, Label, Segment} from "semantic-ui-react";
import React from "react";

export const Parameters = ({onChange, similarityCutoff, degreeCutoff, readOnly}) => {
    const [open, setOpen] = React.useState(true);
    const style = {display: open ? "" : "none"}

    return <Segment>
        <Label as='a' attached='top left' onClick={() => setOpen(!open)}>
            Algorithm Parameters
        </Label>
        <Form style={style}>
            <Form.Field inline className={readOnly ? "disabled" : null}>

                <label style={{'width': '12em'}}>Similarity Cutoff</label>
                <input
                    value={similarityCutoff}
                    onChange={evt => onChange('similarityCutoff', evt.target.value)}
                    style={{'width': '7em'}}
                />
            </Form.Field>
            <Form.Field inline className={readOnly ? "disabled" : null}>
                <label style={{'width': '12em'}}>Degree Cutoff</label>
                <input
                    value={degreeCutoff}
                    onChange={evt => onChange('degreeCutoff', evt.target.value)}
                    style={{'width': '7em'}}
                />
            </Form.Field>
        </Form>
    </Segment>
}