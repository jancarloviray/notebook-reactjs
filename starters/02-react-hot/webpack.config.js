var path = require('path');
var webpack = require('webpack');

const NODE_MODULES_DIR = path.join(__dirname, '/node_modules');
const PORT = process.env.PORT;

var config = {
    // adds sourcemapping for better error pointing
    devtool: 'eval',
    cache: true,
    // Entry point for bundle. If array, all are loaded
    // with last one being exported
    entry: [
        'webpack-dev-server/client?http://0.0.0.0:' + PORT,
        // webpack/hot/dev-server does full F5 reload when error (loses state).
        // Use webpack/hot/only-dev-server instead
        // https://github.com/webpack/webpack/issues/418#issuecomment-54288041
        'webpack/hot/only-dev-server',

        './client/app.js'
    ],
    output: {
        path: path.join(__dirname, '/client/'),
        filename: 'bundle.js',
        // output path from js perspective. there's no
        // need for this when doing dev-server, but
        // it's good to have similar config as production
        publicPath: '/build/'
    },
    resolve: {
        extensions: ['', '.js'],
        // alias: {
        //     'react': NODE_MODULES_DIR + '/react/dist/react.min.js'
        // }
    },
    module: {
        // noParse: [NODE_MODULES_DIR + '/react/dist/react.min.js'],
        loaders: [
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
