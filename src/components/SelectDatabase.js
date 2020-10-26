import {Button, Container, Dropdown, List, Loader, Message} from "semantic-ui-react"
import React from 'react'

import {selectGroup} from "../ducks/algorithms"
import {connect} from "react-redux";
import {
    setActiveDatabase,
    setDatabases,
    setLabels,
    setNodePropertyKeys,
    setPropertyKeys,
    setRelationshipTypes
} from "../ducks/metadata";
import {getActiveDatabase, hasNamedDatabase, onActiveDatabase} from "../services/stores/neoStore";
import {loadMetadata} from "../services/metadata";
import {addDatabase, initLabel} from "../ducks/settings";
import WhatIsMissing from "./Onboarding/WhatIsMissing";
import SelectedDatabase from "./Onboarding/SelectedDatabase";
import {updateMetadata} from "./Startup/startup";
import {OpenCloseSection} from "./Form/OpenCloseSection";

export const hasNodesAndRelationships = (metadata) => {
    return (metadata.labels.length > 0 && metadata.relationshipTypes.length > 0)
}

const SelectDatabase = (props) => {
    const {setActiveDatabase, metadata} = props
    const [activeDatabaseSelected, setActiveDatabaseSelected] = React.useState(true)

    const onRefresh = (selectedDatabase) => {
        setActiveDatabaseSelected(false)
        loadMetadata(props.metadata.versions.neo4jVersion).then(metadata => {
            updateMetadata(props, metadata, selectedDatabase)
            setActiveDatabaseSelected(true)
        })
    }



    const containerStyle = {
        padding: '1em'
    }

    const credentials = props.connectionInfo.credentials

    const databaseOptions = metadata.databases.map(value => {
        return {key: value.name, value: value.name, text: (value.name) + (value.default ? " (default)" : "")};
    })


    return (<div style={containerStyle}>
            <Container fluid>
                <OpenCloseSection title="Database Connection">

                    <List className="connection update">
                        <List.Item className="connection-item update">
                            <label>Username</label>
                            <span>{credentials.username}</span>
                        </List.Item>
                        <List.Item className="connection-item update">
                            <label>Server</label>
                            <span>{credentials.host}</span>
                        </List.Item>
                        <List.Item className="connection-item update">
                            <label>Database</label>

                                <Dropdown compact value={metadata.activeDatabase} placeholder='Database' search selection
                                          style={{"width": "290px"}}
                                          options={databaseOptions} onChange={(evt, data) => {
                                    if (data.value !== getActiveDatabase()) {
                                        setActiveDatabase(data.value);
                                        onActiveDatabase(data.value);
                                        onRefresh(data.value)
                                    }
                                }}/>
                                {hasNamedDatabase() ?
                                    <Button icon style={{marginLeft: "10px"}} onClick={() => {
                                        onRefresh(props.metadata.activeDatabase)
                                    }}>
                                        Refresh databases
                                    </Button> : null}

                        </List.Item>
                    </List>


                <div style={{paddingTop: "10px"}}>
                    {
                        activeDatabaseSelected ?
                            (hasNodesAndRelationships(props.metadata)) ?
                                <SelectedDatabase onRefresh={() => onRefresh(props.metadata.activeDatabase)}/> :
                                <WhatIsMissing setDatasetsActive={props.setDatasetsActive}/>
                            : <Message>
                                <Message.Header>Refreshing</Message.Header>
                                <Message.Content>
                                    <Loader active inline style={{padding: "5px 0"}}/>
                                </Message.Content>
                            </Message>

                    }

                </div>
                </OpenCloseSection>
            </Container>

        </div>

    )

}


const mapStateToProps = state => ({
    activeGroup: state.algorithms.group,
    metadata: state.metadata,
    labels: state.settings.labels,
    connectionInfo: state.connections,
})

const mapDispatchToProps = dispatch => ({
    selectGroup: group => dispatch(selectGroup(group)),
    setActiveDatabase: database => dispatch(setActiveDatabase(database)),
    setDatabases: databases => dispatch(setDatabases(databases)),
    setLabels: labels => dispatch(setLabels(labels)),
    setRelationshipTypes: relationshipTypes => dispatch(setRelationshipTypes(relationshipTypes)),
    setPropertyKeys: propertyKeys => dispatch(setPropertyKeys(propertyKeys)),
    setNodePropertyKeys: propertyKeys => dispatch(setNodePropertyKeys(propertyKeys)),
    addDatabase: database => dispatch(addDatabase(database)),
    initLabel: (database, label, color, propertyKeys) => dispatch(initLabel(database, label, color, propertyKeys))
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectDatabase)
