var webpack = require('webpack');

// part of webpack's dependency injection.
// this defines free variables. it is useful for having development
// build with debug loggin or adding global constants.
// http://webpack.github.io/docs/list-of-plugins.html#defineplugin
var definePlugin = new webpack.DefinePlugin({ IS_CLIENT: 'true' });

var config = {

    // cache generated modules and chunks to
    // improve performance for multiple
    // incremental builds. This is enabled
    // by default in watch mode
    cache: true,

    resolve: {
        // an array of extension that should be
        // used to resolve modules. this will
        // allow you to not have the need to type
        // in the 'js' in require('someModule.js')
        extensions: ['', '.js']
    },

    // the entry point for the bundle.
    // If you pass a string, the string resolves
    // to a module which is loaded upon startup.
    // If you pass an array, all modules are loaded
    // upon startup and the last one is exported.
    // If you pass an object, multiple entry bundles
    // are created.
    //
    // http://webpack.github.io/docs/configuration.html#entry
    entry: [
        'webpack-dev-server/client?http://localhost:3001',
        'webpack/hot/dev-server',
        './client.js'
    ],

    // options affecting the output
    output: {
        // the output directory as absolute path
        path: __dirname + '/build/',

        // the filename of the chunk as relative path
        // inside the output.path directory.
        // Note that you must NOT specify an absolute
        // path here. Use the output.path option.
        // [name] is replaced by name of chunk.
        // [hash] is replace by hash of compilation
        // [chunkhash] is replaced by hash of chunk
        //
        // here, the output will be on
        // /build/client.js so you must include
        // <script src='/build/client.js' defer>...
        // in your index.
        filename: 'client.js',

        // the output.path from the javascript
        // perspective. If you do not know the
        // publicPath while compiling, you can
        // omit it and set __webpack_public_path__
        // on runtime.
        //
        // this is for development mode, so
        // if NODE_ENV === 'development', add this:
        // <script src='http://localhost:3001/build/client.js'...
        publicPath: 'http://localhost:3001/build'
    },

    // plugins are included in your module by using
    // the plugins propery here
    plugins: [

        // enables hot module replacement
        new webpack.HotModuleReplacementPlugin(),

        definePlugin
    ],

    module: {
        // an array of automatically applied loaders.
        // Each item can have these properties:
        // test: a condition that must be met
        // exclude: a condition that must not be met
        // include: a condition that must be met
        // loader: a string of '!' separated loaders
        // loaders: an array of loaders as string
        loaders: [
            // NOTE: the loaders here are resolved to the
            // resources which they are applied to. This
            // means that they are not resolved relative to
            // the configuration file. If you have loaders
            // installed from npm and your node_modules
            // folder is not part of the parent folder of
            // all source files, webpack cannot find the
            // loader. You need to add node_modules as
            // absolute path to the `resolveLoader.root`
            // option.
            // {resolveLoader:{root:path.join(__dirname,'node_modules')}}
            {test: /\.js$/, loaders: ['react-hot', 'jsx']},
            {test: /\.json$/, loaders: ['json']}
        ]
    }
};

module.exports = config;

if(process.env.NODE_ENV === 'development'){
    // choose a developer tool to enhance debugging.
    // eval: each module is executed with eval and //@sourceUrl
    config.devtool = 'eval';
}
