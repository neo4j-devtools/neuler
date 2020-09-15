import {subscribeToDatabaseCredentialsForActiveGraph} from 'graph-app-kit/components/GraphAppBase'
import {
    getDriver,
    mainNeo4jVersion,
    onDisconnected,
    onNeo4jVersion,
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

export const tryConnect = credentials => {
    onNewConnection(credentials)
    return getDriver().verifyConnectivity().then(value => {
        onNeo4jVersion(value.version.split("/")[1])
        return Promise.resolve(mainNeo4jVersion())
    }).then(version => {
        if (version < 4) {
            return runCypherDefaultDatabase("RETURN 1")
        } else {
            return runCypherSystemDatabase("show databases")
        }
    })
}