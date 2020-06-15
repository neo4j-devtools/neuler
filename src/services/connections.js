import { subscribeToDatabaseCredentialsForActiveGraph } from 'graph-app-kit/components/GraphAppBase'
import {onDisconnected, onNewConnection, runCypher, runCypherDefaultDatabase} from "./stores/neoStore"

export const initializeConnection = (setConnected, setDisconnected) => {
  if (window.neo4jDesktopApi) {
    subscribeToDatabaseCredentialsForActiveGraph(window.neo4jDesktopApi,
      (credentials, activeProject, activeGraph) => {
        onNewConnection(credentials)
        setConnected(credentials)
      },
      () => {
        setDisconnected()
        onDisconnected()
      }
    )
    window.neo4jDesktopApi.showMenuOnRightClick && window.neo4jDesktopApi.showMenuOnRightClick(false)
  } else {
    const credentials = {
      username: 'neo4j',
      password: 'neo4j'
    }

    tryConnect(credentials)
      .then(() => setConnected(credentials))
      .catch((error) => {console.log(error)})
  }
}

export const tryConnect = credentials => {
  onNewConnection(credentials)
  return runCypherDefaultDatabase("RETURN 1")
}