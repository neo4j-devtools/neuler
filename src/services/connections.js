import {subscribeToDatabaseCredentialsForActiveGraph} from './graph-app-kit/helpers'
import {
    extractMainVersion,
    onDisconnected,
    onNewConnection,
    runCypherDefaultDatabase,
    runCypherSystemDatabase
} from "./stores/neoStore"

export const initializeDesktopConnection = (setConnected, setDisconnected, onError, setActiveProject, setActiveGraph, noActiveGraph) => {
    if (window.neo4jDesktopApi) {
        subscribeToDatabaseCredentialsForActiveGraph(window.neo4jDesktopApi,
            (credentials, activeProject, activeGraph) => {
                setActiveProject(activeProject.name)
                setActiveGraph(activeGraph.name)
                onNewConnection(credentials).then(version => {
                    setConnected(credentials)
                })
            },
            () => {
                setDisconnected()
                noActiveGraph()
                onDisconnected()
            }
        )
        window.neo4jDesktopApi.showMenuOnRightClick && window.neo4jDesktopApi.showMenuOnRightClick(false)
    }
}

export const tryConnect = credentials => {
    return onNewConnection(credentials).then(version => {
        const mainVersion = extractMainVersion(version)
        if (mainVersion < 4) {
            return runCypherDefaultDatabase("RETURN 1")
        } else {
            return runCypherSystemDatabase("show databases")
        }
    })

}