import {Button, Message} from "semantic-ui-react";
import React from "react";
import {connect} from "react-redux";


const whatIsMissing = (metadata) => {
    const hasNodeLabels = metadata.labels.length > 0;
    const hasRelationshipTypes = metadata.relationshipTypes.length > 0;

    if(!hasNodeLabels && !hasRelationshipTypes) {
        return "nodes or relationships"
    }

    if(!hasNodeLabels) {
        return "nodes";
    }

    if(!hasRelationshipTypes) {
        return "relationships"
    }

    return null
}

const WhatIsMissing = ({metadata,  setDatasetsActive}) => {
    return <div>
        <Message color='purple'>
            <Message.Header>
                Missing: {whatIsMissing(metadata)}.
            </Message.Header>
            <Message.Content>
                <div>
                    <p>
                        This database does not contain any {whatIsMissing(metadata)}.
                        You need to load some data, otherwise the graph algorithms won't return any results.
                    </p>
                    <p>
                        If you don't have any data, you can load one of the sample graphs.
                    </p>

                    <Button primary onClick={() => setDatasetsActive(true)}>
                        View Sample Graphs
                    </Button>
                </div>
            </Message.Content>
        </Message>

    </div>
}

const mapStateToProps = state => ({
    metadata: state.metadata
})

export default connect(mapStateToProps)(WhatIsMissing)
