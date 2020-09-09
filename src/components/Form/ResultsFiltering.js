import React from 'react'
import {Dropdown, Form, Label, Segment} from "semantic-ui-react";

export const ResultsFiltering = ({limit, communityNodeLimit, returnsCommunities, updateCommunityNodeLimit, updateLimit}) => {
    return <Segment>
        <Label as='a' attached='top left'>
            Results Filtering
        </Label>
        <Form>
            <Form.Field>
                <label >Rows to show</label>
                <input
                    type='number'
                    placeholder="Rows"
                    min={1}
                    max={1000}
                    step={1}
                    value={limit}
                    onChange={updateLimit}
                />
            </Form.Field>
            {returnsCommunities ?
                <Form.Field>
                    <label>Community Node Limit</label>
                    <input
                        type='number'
                        placeholder="# of nodes"
                        min={1}
                        max={1000}
                        step={1}
                        value={communityNodeLimit}
                        onChange={updateCommunityNodeLimit}
                    />
                </Form.Field> : null
            }
        </Form>
    </Segment>
}