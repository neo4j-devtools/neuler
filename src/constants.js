export default {
    env: window.location.href.indexOf('neuler.graphapp.io') > -1 ? 'prod' : 'dev',
    mixpanelId: {
        dev: 'e71d493fc40289f04b92ba09c751d698',
        prod: 'c4488ddf14af6efe91014e60cecef01e'
    },
    defaultLimit: 42,
    defaultCommunityNodeLimit: 10,
    version: "0.1.35"
}