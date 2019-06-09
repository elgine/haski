const path = require('path');

module.exports = {
    title: 'recto',
    devServer: {
        port: 3000,
        contentBase: path.resolve(__dirname, '../static')
    },
    staticDir: path.resolve(__dirname, '../static'),
    outputDir: path.resolve(__dirname, '../dist/common'),
    electronRendererDir: path.resolve(__dirname, '../dist/electron/renderer'),
    electronMainDir: path.resolve(__dirname, '../dist/electron/main')
};