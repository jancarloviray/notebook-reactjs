var path = require('path');

const APP_ENTRY = 'app.js'
const BUILD_DIR = 'build'
const BUNDLE_NAME = 'bundle.js'

var config = {
    entry: [
        path.resolve(__dirname, APP_ENTRY)
    ],
    output: {
        path: path.resolve(__dirname, BUILD_DIR),
        filename: BUNDLE_NAME
    },
    module: {
        loaders: [
            // es6
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
        ]
    }
};

module.exports = config;
