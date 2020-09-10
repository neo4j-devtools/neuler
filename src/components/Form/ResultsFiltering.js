import React from 'react'
import {Form, Input, Label, Segment} from "semantic-ui-react";

export const ResultFilteringFields = ({limit, communityNodeLimit, returnsCommunities, updateCommunityNodeLimit, updateLimit, readOnly}) => {
    return <React.Fragment>
        <Form.Field disabled={readOnly} inline label={<label style={{'width': '12em'}}>Rows to show</label>}
                    control={Input} type='number' value={limit} onChange={updateLimit} min={1} max={1000} step={1}/>

        {returnsCommunities ?
            <Form.Field disabled={readOnly} inline
                        label={<label style={{'width': '12em'}}>Community Node Limit</label>}
                        control={Input} type='number' value={communityNodeLimit} onChange={updateCommunityNodeLimit}
                        min={1} max={1000} step={1}/>
            : null
        }
    </React.Fragment>
}

export const ResultsFilteringWrapper = ({children}) => {
    const [open, setOpen] = React.useState(true);
    const style = {display: open ? "" : "none"}

    return <Segment>
        <Label as='a' attached='top left' onClick={() => setOpen(!open)}>
            Results
        </Label>


        <Form style={style}>
            {children}
        </Form>
    </Segment>
}