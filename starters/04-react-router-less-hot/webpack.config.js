const path = require('path');
const webpack = require('webpack');
const PORT = process.env.PORT;
const NODE_MODULES_DIR = path.join(__dirname, '/node_modules');

var config = {
    // adds sourcemapping for better error pointing
    devtool: 'eval',
    cache: true,
    // Entry point for bundle. If array, all are loaded
    // with last one being exported
    entry: [
        'webpack-dev-server/client?http://0.0.0.0:' + PORT,
        // dev-server does full F5 reload when error (loses state).
        // Use only-dev-server instead
        'webpack/hot/only-dev-server',
        './client/app.js'
    ],
    output: {
        path: path.join(__dirname, '/build/'),
        filename: 'bundle.js',
        // output path from js perspective. there's no
        // need for this when doing dev-server, but
        // it's good to have similar config as production
        publicPath: '/build/'
    },
    resolve: {
        extensions: ['', '.js'],
        alias: {
            'bootstrap': NODE_MODULES_DIR + '/bootstrap/less/bootstrap.less'
        }
    },
    module: {
        // noParse: [NODE_MODULES_DIR + '/react/dist/react.min.js'],
        loaders: [
            {
                test: /\.less$/,
                loaders: ['style','css','less']
            },
            {
                test: /\.css$/,
                loaders: ['style','css']
            },
            {
                test: /\.(png|jpg|jpeg)$/,
                loader: 'url-loader?limit=8192'
            },
            {
                test: /\.(woff|woff2)$/,
                loader: 'url-loader?limit=10000&mimetype=application/font-woff'
            },
            {
                test: /\.(ttf|eot|svg)$/,
                loader: 'file-loader?limit=8192'
            },
            {
                test: /\.js$/,
                loaders: ['react-hot','babel-loader','jsx?harmony'],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        // hot module replacement has to be included
        new webpack.HotModuleReplacementPlugin(),
        // tells reloader not to reload if there is syntax error
        new webpack.NoErrorsPlugin()
    ]
};

module.exports = config;
