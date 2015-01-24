module.exports = {
    entry: './app.jsx',

    // entry: {
    //     app: ['webpack/hot/dev-server', './app.jsx']
    // },

    // where the compiled js will be outputted
    output: {
        filename: 'bundle.js',
        path: __dirname,

        // this is used to generate URLs, ie: put cdn url here
        // publicPath: 'http://localhost:8080/assets'
    },
    module: {
        loaders: [
            // ?insertPragma=React.DOM auto inserts pragma required
            // ?harmony enables ES6 features
            {test: /\.jsx$/, loader: 'jsx-loader?insertPragma=React.DOM&harmony'}
        ]
    },
    externals: {
        // don't bundle the 'react' npm package with bundle.js
        // but rather get it from a global 'React' variable
        'react':'React'
    },
    resolve: {
        // allow to omit extension when doing 'require'
        extensions: ['', '.js','.jsx']
    }
}
