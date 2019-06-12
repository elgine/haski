const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const config = require('./config');
const { getWebpackMode, isDev } = require('./util');
const htmlTemplate = require('./htmlTemplate');

let env;

const plugins = [
    new webpack.optimize.OccurrenceOrderPlugin()
];

if (isDev()) {
    env = {
        devtool: 'source-map',
        devServer: {
            historyApiFallback: true,
            inline: true,
            hot: true,
            ...config.devServer
        },
        module: {
            rules: [
                {
                    test: /\.(less|css)$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'less-loader',
                            options: {
                                javascriptEnabled: true
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    };
} else {
    env = {
        module: {
            rules: [
                {
                    test: /\.(less|css)$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            'css-loader',
                            'postcss-loader',
                            {
                                loader: 'less-loader',
                                options: {
                                    javascriptEnabled: true
                                }
                            }
                        ]
                    })
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin({
                filename: 'css/index.css'
            }),
            new CompressionWebpackPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: /\.(js|css)$/,
                threshold: 10240,
                minRatio: 0.8
            })
        ]
    };
}

const base = {
    output: {
        path: config.outputDir,
        filename: '[name].[hash].js',
        publicPath: '/',
        chunkFilename: '[name].[hash].js'
    },
    mode: getWebpackMode(),
    resolve: {
        extensions: ['.tsx', '.ts', '.less', '.css', '.js', '.json'],
        alias: {
            '@haski': path.resolve(__dirname, '../engine/src'),
            '@gl-core': path.resolve(__dirname, '../gl-core/src'),
            '@core': path.resolve(__dirname, '../core/src'),
            '@ecs': path.resolve(__dirname, '../ecs/src'),
            '@maths': path.resolve(__dirname, '../maths/src'),
            '@utils': path.resolve(__dirname, '../utils/src'),
            'dragonBones': path.resolve(__dirname, '../dragonBones/dragonBones.js')
        },
        plugins: [new TsconfigPathsPlugin({/* options: see below */})]
    },
    module: {
        rules: [
            // {
            //     test: /\jsx?.$/,
            //     exclude: /node_modules/,
            //     loader: 'babel-loader'
            // },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true
                }
            },
            {
                test: /\.(png|jpeg|jpg|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 5000,
                    name: '[name].[ext]',
                    outputPath: 'image/'
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
                loader: 'file-loader',
                options: {
                    limit: 10000,
                    name: '[name].[ext]',
                    outputPath: 'media/'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)$/,
                loader: 'file-loader',
                options: {
                    limit: 10000,
                    name: '[name].[ext]',
                    outputPath: 'font/'
                }
            }
        ]
    },
    optimization: {
        runtimeChunk: false,
        splitChunks: {
            cacheGroups: {
                vendor1: {
                    name: 'vendor1',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/](react|react-dom|antd|redux|react-redux|redux-saga|dragonBones)[\\/]/,
                    maxAsyncRequests: 5,
                    priority: 10,
                    enforce: true
                },
                vendor2: {
                    name: 'vendor2',
                    chunks: 'all',
                    maxAsyncRequests: 5,
                    reuseExistingChunk: true,
                    test: /[\\/]node_modules[\\/]/,
                    priority: 9,
                    enforce: true
                }
            }
        }
    },
    plugins
};


module.exports = ({ html } = {}) => {
    let htmlOptions = {};
    if (html) {
        if (html.template) {
            htmlOptions.template = html.template;
        } else if (html.templateContent) {
            htmlOptions.templateContent = html.templateContent;
        } else {
            htmlOptions.templateContent = htmlTemplate(isDev());
        }
    }
    base.plugins.push(new HtmlWebpackPlugin({
        title: config.title,
        filename: 'index.html',
        hash: true,
        inject: true,
        ...htmlOptions
    }));
    return merge(base, env);
};