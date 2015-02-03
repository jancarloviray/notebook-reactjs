var webpack = require('webpack');
var WebpackDevServer = require('require-dev-server');
var config = require('./webpack.config');
var compiler = webpack(config)

var port = process.env.HOT_LOAD_PORT || 3001;

new WebpackDevServer(compiler, {
    // webpack-dev-server options
    // --------------------------

    // Base path for the content.
    // Can be file, directory or url.
    contentBase: 'http://localhost:3000',

    // Important for 'hot module replacement'.
    hot: true

    // webpack-dev-middleware options
    // ------------------------------

    // The path where to bind the middleware
    // to the server. In most cases, this
    // equals the webpack configuration options
    // `output.publicPath`
    publicPath: config.output.publicPath,

    // only warnings and errors will be
    // displayed to console
    noInfo: true,

    // the delay after a change
    watchDelay: 100
}).listen(port, 'localhost', function(err, result){
    if(err){ console.error(err); }
    console.log('WebpackDevServer listening at localhost:' + port);
});

