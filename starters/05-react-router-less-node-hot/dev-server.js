'use strict';

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var compiler = webpack(config);

var HOT_LOAD_PORT = process.env.HOT_LOAD_PORT || 3001;

new WebpackDevServer(compiler, {
    contentBase: 'http://0.0.0.0:3000',
    publicPath: config.output.publicPath,
    hot: true,
    // display only warnings/errors
    noInfo: true,
    watchDelay: 50
}).listen(HOT_LOAD_PORT, '0.0.0.0', function(err, result){
    if(err){ console.log(err); }
    console.log('dev-server is listening at 0.0.0.0:' + HOT_LOAD_PORT);
});
