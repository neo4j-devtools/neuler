import {checkApocInstalled, checkGraphAlgorithmsInstalled} from "../../services/installation";
import {loadMetadata, loadVersions} from "../../services/metadata";
import {sendMetrics} from "../metrics/sendMetrics";
import {onNeo4jVersion} from "../../services/stores/neoStore";
import {selectCaption, selectRandomColor} from "../NodeLabel";

export const ALL_DONE = "all-done";
export const CONNECTING_TO_DATABASE = "connect-server";
export const SELECT_DATABASE = "select-database";
export const CHECKING_GDS_PLUGIN = "gds";
export const CHECKING_APOC_PLUGIN = "apoc";
export const steps = [
    CONNECTING_TO_DATABASE, CHECKING_GDS_PLUGIN, CHECKING_APOC_PLUGIN, ALL_DONE
]

export const webAppSteps = [
    CONNECTING_TO_DATABASE, SELECT_DATABASE, CHECKING_GDS_PLUGIN, CHECKING_APOC_PLUGIN, ALL_DONE
]

export const onConnected = (props, finished = () => {}) => {
    checkGraphAlgorithmsInstalled().then((gdsInstalled) => {
        checkApocInstalled().then(apocInstalled => {
            if (apocInstalled && gdsInstalled) {
                loadVersions().then(versions => {
                    sendMetrics("neuler-connected", true, versions)

                    props.setGds(versions)
                    onNeo4jVersion(versions.neo4jVersion)
                    loadMetadata(versions.neo4jVersion).then(metadata => {
                        props.setLabels(metadata.labels)
                        props.setRelationshipTypes(metadata.relationships)
                        props.setPropertyKeys(metadata.propertyKeys)
                        props.setNodePropertyKeys(metadata.nodePropertyKeys)
                        props.setDatabases(metadata.databases)

                        metadata.databases.forEach(database => {
                            props.addDatabase(database.name)
                        })

                        metadata.labels.forEach(label => {
                            props.initLabel(props.metadata.activeDatabase, label.label, selectRandomColor(), selectCaption(metadata.nodePropertyKeys[label.label]))
                        })

                        finished()
                    })
                });
            } else {
                sendMetrics("neuler", "neuler-connected-incomplete", {gdsInstalled, apocInstalled})
            }
        })
    });
}