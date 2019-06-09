const merge = require('webpack-merge');
const config = require('./config');

module.exports = merge(require('./webpack.config.base'), {
    target: 'electron-renderer',
    output: {
        path: config.electronRendererDir
    }
});