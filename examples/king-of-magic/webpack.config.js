const merge = require('webpack-merge');
const path = require('path');

module.exports = merge(require('../../build/webpack.config.base')(), {
    entry: path.resolve(__dirname, './src/index.ts'),
    devServer: {
        contentBase: path.resolve(__dirname, './static')
    }
});