const rewire = require('rewire');
const defaults = rewire('react-scripts/scripts/build.js');
const config = defaults.__get__('config');

// Consolidate chunk files instead
config.optimization.splitChunks = {
    cacheGroups: {
        default: false,
    },
    chunks: 'all',
    name: true
};
// Move runtime into bundle instead of separate file
config.optimization.runtimeChunk = false;
config.optimization.minimize = false;

// JS
config.output.filename = '[name].js';

// CSS. "5" is MiniCssPlugin
const minifier = config.plugins.find((plugin) => plugin.constructor.name === "MiniCssExtractPlugin");
minifier.options.filename = '[name].css';
minifier.options.publicPath = '../';
