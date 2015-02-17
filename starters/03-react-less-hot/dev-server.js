const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');

const PORT = process.env.PORT;

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    // display only warnings/errors
    noInfo: true,
    watchDelay: 50
}).listen(PORT, 'localhost', function(err, result){
    if(err){ console.log(err); }
    console.log('listening at localhost:' + PORT);
});
