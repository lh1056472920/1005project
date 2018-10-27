const path = require('path')
const webpack = require('webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = {
    entry: {
        main: './src/main.js',
        middleware: './src/middleware.js',
        vendor: ["axios", "bignumber.js", "clipboard", "crypto-js", "echarts", "eosjs", "ethereumjs-tx", "ethereumjs-wallet", "keythereum", "mint-ui", "qrcode", "v-tap", "vue", "vue-awesome-swiper", "vue-i18n", "vue-router", "vuex", "web3"]
    },
    output: {
        filename: '[name].[chunkhash:8].js',
        path: path.resolve(__dirname, '../dist')
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            '@': path.resolve('static')
        }
    },
    module: {
        rules: [{
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                use: 'json-loader'
            },
            {
                test: /\.(png|jpg|jpeg|gif|woff|ttf|eot|svg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000
                    }
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextWebpackPlugin.extract({
                    fallback: 'style-loader',
                    use: {
                        loader: 'css-loader',
                        options: {
                            minimize: true //css压缩
                        }
                    }
                })
            },
            {
                test: /\.less$/,
                use: ExtractTextWebpackPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                            loader: 'css-loader',
                            options: {
                                minimize: true //css压缩
                            }
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                minimize: true //css压缩
                            }
                        }
                    ]
                })
            },
        ]
    },
    node: {
        fs: 'empty'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new HTMLWebpackPlugin({
            filename: 'index.html',
            template: './index.html',
            inject: 'body'
        }),
        new ExtractTextWebpackPlugin('style.[contenthash:8].css'),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
        }),
        new UglifyjsWebpackPlugin({
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true
            }
        }),
        new CleanWebpackPlugin(
            ['*.js', '*.css'], {
                root: path.resolve(__dirname, '../dist'),
                verbose: true,
                dry: false
            }
        ),
        new CopyWebpackPlugin([{
                from: path.resolve(__dirname, '../static/images/coin'),
                to: path.resolve(__dirname, '../dist/coin')
            },
            {
                from: path.resolve(__dirname, '../static/images/drawable-xxhdpi'),
                to: path.resolve(__dirname, '../dist/drawable-xxhdpi')
            }
        ])
    ]
}

module.exports = config