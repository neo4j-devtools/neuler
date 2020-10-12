import React from 'react'
import AlgoResults from './AlgoResults'
import {refreshMetadata} from "./Startup/startup";
import {addDatabase, initLabel, limit} from "../ducks/settings";
import {
    setDatabases,
    setLabels,
    setNodePropertyKeys,
    setPropertyKeys,
    setRelationshipTypes,
    setVersions
} from "../ducks/metadata";
import {connect} from "react-redux";

const MainContent = (props) => {
    const mainStyle = {
        display: 'flex',
    }

    const onComplete = () => {
        refreshMetadata(props)
    }

    return (
        <div style={mainStyle}>
            <div style={{width: '100%', justifyContent: "center", flexGrow: "1"}}>
                <AlgoResults onComplete={onComplete}/>
            </div>
        </div>
    )

}

const mapStateToProps = state => ({
    activeMenuItem: state.menu.item,
    limit: state.settings.limit,
    communityNodeLimit: state.settings.communityNodeLimit,
    metadata: state.metadata
})

const mapDispatchToProps = dispatch => ({
    updateLimit: value => dispatch(limit(value)),
    setLabels: labels => dispatch(setLabels(labels)),
    setGds: version => dispatch(setVersions(version)),
    setRelationshipTypes: relationshipTypes => dispatch(setRelationshipTypes(relationshipTypes)),
    setPropertyKeys: propertyKeys => dispatch(setPropertyKeys(propertyKeys)),
    setRelationshipTypes: relationshipTypes => dispatch(setRelationshipTypes(relationshipTypes)),
    setNodePropertyKeys: propertyKeys => dispatch(setNodePropertyKeys(propertyKeys)),
    setDatabases: databases => dispatch(setDatabases(databases)),
    addDatabase: database => dispatch(addDatabase(database)),
    initLabel: (database, label, color, propertyKeys) => dispatch(initLabel(database, label, color, propertyKeys)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MainContent)
