import { subscribeToDatabaseCredentialsForActiveGraph } from 'graph-app-kit/components/GraphAppBase'
import { onDisconnected, onNewConnection, runCypher } from "./stores/neoStore"

export const initializeConnection = (setConnected, setDisconnected) => {
  if (window.neo4jDesktopApi) {
    subscribeToDatabaseCredentialsForActiveGraph(window.neo4jDesktopApi,
      (credentials, activeProject, activeGraph) => {
        console.log("credentials", credentials)
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
      .catch(() => {})
  }
}

export const tryConnect = credentials => {
  onNewConnection(credentials)
  return runCypher("RETURN 1")
}