module.exports = {
    entry: './app.jsx',
    output: {
        filename: 'bundle.js',

        // make sure 8090 is port for webpack-dev-server
        publicPath: 'http://localhost:8090/assets'
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
        extensions: ['', '.js','.jsx']
    }
}
