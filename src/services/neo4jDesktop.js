import {split} from 'apollo-link'
import {createHttpLink, HttpLink} from 'apollo-link-http'
import {WebSocketLink} from 'apollo-link-ws'
import {setContext} from 'apollo-link-context'
import {getMainDefinition} from 'apollo-utilities'

// import getWorkspaceQuery from "./getWorkspaceQuery";
// import onWorkspaceChangeSub from "./onWorkspaceChangeSub";

export const getLink = (isBrowser) => {
  if (isBrowser) {
    // Some Uri as placeholder, will eventaully need server here
    return new HttpLink({ uri: 'https://48p1r2roz4.sse.codesandbox.io' })
  } else {
    const url = new URL(window.location.href)
    const apiEndpoint = url.searchParams.get('neo4jDesktopApiUrl')
    const apiClientId = url.searchParams.get('neo4jDesktopGraphAppClientId')

    const apiEndpointUrl = new URL(apiEndpoint)

    const apiEndpointNoScheme = `${apiEndpointUrl.host}${
      apiEndpointUrl.pathname ? apiEndpointUrl.pathname : ''
      }`

    const httpLink = createHttpLink({
      uri: apiEndpoint !== null ? apiEndpoint : undefined,
    })

    const wsLink = new WebSocketLink({
      uri: `ws://${apiEndpointNoScheme}`,
      options: {
        reconnect: true,
        connectionParams: {
          ClientId: apiClientId,
        },
      },
    })

    const authLink = setContext((_, { headers }) => {
      return {
        headers: {
          ...headers,
          ClientId: apiClientId,
        },
      }
    })

    const link = split(
      // split based on operation type
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query)
        return kind === 'OperationDefinition' && operation === 'subscription'
      },
      wsLink,
      authLink.concat(httpLink)
    )

    return link
  }
}
