import constants from "../../constants";

const mixpanel = require('mixpanel-browser');
const env = constants.env;
mixpanel.init(constants.mixpanelId[env]);

export const sendMetrics = (category, label, data = {}) => {
    // console.log(category, label, data)
    if (!!window.neo4jDesktopApi) {
        window.neo4jDesktopApi.sendMetrics(category, label, data)
    } else {
        if (mixpanel && mixpanel.track) {
            const eventName = `NEULER_${category}_${label}`
            // console.log(eventName, data)
            mixpanel.track(eventName, {...data});
        }
    }
}
