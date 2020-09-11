import {subscribeToDatabaseCredentialsForActiveGraph} from 'graph-app-kit/components/GraphAppBase'
import {onDisconnected, onNewConnection, runCypherDefaultDatabase} from "./stores/neoStore"

export const initializeDesktopConnection = (setConnected, setDisconnected, onError, setActiveProject, setActiveGraph, noActiveGraph) => {
    if (window.neo4jDesktopApi) {
        subscribeToDatabaseCredentialsForActiveGraph(window.neo4jDesktopApi,
            (credentials, activeProject, activeGraph) => {
                setActiveProject(activeProject.name)
                setActiveGraph(activeGraph.name)
                onNewConnection(credentials)
                setConnected(credentials)
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

export const initializeWebConnection = (setConnected, setDisconnected, onError) => {
    const credentials = {
        username: 'neo4j',
        password: 'neo4j'
    }

    tryConnect(credentials)
        .then(() => setConnected(credentials))
        .catch((error) => {
            onError(error)
        })

}

export const tryConnect = credentials => {
    onNewConnection(credentials)
    return runCypherDefaultDatabase("RETURN 1")
}