'use strict';

var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var ENV = process.env.npm_lifecycle_event;
var isTest = ENV === 'test' || ENV === 'test-watch';
var isProd = ENV === 'build';

module.exports = function makeWebpackConfig() {
    var config = {};

    config.entry = isTest ? void 0 : {
        app: './src/app.js'
    };

    config.output = isTest ? {} : {
        path: __dirname + '/dist',

        publicPath: '/',

        filename: isProd ? '[name].[hash].js' : '[name].bundle.js',

        chunkFilename: isProd ? '[name].[hash].js' : '[name].bundle.js'
    };

    if (isTest) {
        config.devtool = 'inline-source-map';
    }
    else if (isProd) {
        config.devtool = 'source-map';
    }
    else {
        config.devtool = 'eval-source-map';
    }

    config.module = {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: isTest ? 'null-loader' : ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: [
                        {loader: 'css-loader', query: {sourceMap: true}},
                        {loader: 'postcss-loader'}
                    ],
                })
            },
            {
                test: /\.scss$/,
                loader: isTest ? 'null-loader' : ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: [
                        {loader: 'css-loader', query: {sourceMap: true}},
                        {loader: 'sass-loader', },
                        {loader: 'postcss-loader'}
                    ],
                })
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
                loader: 'file-loader'
            },
            {
                test: /\.html$/,
                loader: 'raw-loader'
            }
        ]
    };

    if (isTest) {
        config.module.rules.push({
            enforce: 'pre',
            test: /\.js$/,
            exclude: [
                /node_modules/,
                /\.spec\.js$/
            ],
            loader: 'istanbul-instrumenter-loader',
            query: {
                esModules: true
            }
        })
    }

    config.plugins = [
        new webpack.LoaderOptionsPlugin({
            test: /\.scss$/i,
            options: {
                postcss: {
                    plugins: [autoprefixer]
                }
            }
        })
    ];

    if (!isTest) {
        config.plugins.push(
            new HtmlWebpackPlugin({
                template: './index.html',
                inject: 'body'
            }),

            new ExtractTextPlugin({filename: 'css/[name].css', disable: !isProd, allChunks: true})
        )
    }

    if (isProd) {
        config.plugins.push(
            new webpack.NoErrorsPlugin(),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin(),
            new CopyWebpackPlugin([{
                from: __dirname + '/src/public'
            }])
        )
    }

    config.devServer = {
        contentBase: './src/public',
        stats: 'minimal',
        host: '127.0.0.1'
    };

    return config;
}();