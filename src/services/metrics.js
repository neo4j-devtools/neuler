import gql from 'graphql-tag'


export const SEND_METRICS_MUTATION = gql`
    mutation SendMetrics(
        $eventCategory: String!
        $eventLabel: String!
        $eventName: String!
        $eventValue: String!
    ) {
        sendMetrics(
            event: {
                category: $eventCategory
                label: $eventLabel
                properties: [{ name: $eventName, value: $eventValue }]
            }
        )
    }
`