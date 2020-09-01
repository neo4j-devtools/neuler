export const sendMetrics = (category, label, data = {}) => {
    if (!!window.neo4jDesktopApi) {
        window.neo4jDesktopApi.sendMetrics(category, label, data)
    }
}