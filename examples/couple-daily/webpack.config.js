const merge = require('webpack-merge');
const path = require('path');

module.exports = merge(require('../../build/webpack.config.base')({
    html: {
        template: path.resolve(__dirname, './index.html')
    }
}), {
    entry: path.resolve(__dirname, './src/index.ts'),
    devServer: {
        contentBase: path.resolve(__dirname, './assets')
    }
});