const path = require('path');
const config = require('./config');
const { getWebpackMode } = require('./util');

module.exports = {
    entry: path.resolve(__dirname, '../src/main/index.js'),
    output: {
        path: config.electronMainDir,
        filename: '[name].[hash].js'
    },
    mode: getWebpackMode(),
    target: 'electron-main'
};