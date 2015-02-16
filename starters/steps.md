# Starter Steps

## Install Webpack

`npm init`
`npm install webpack -g` to install webpack globally
`npm install webpack` to install project version

## Folder Structure

```
/app
	main.js
	component.js
/build
	bundle.js (auto created)
index.html
package.json
webpack.config.js
```

## Install Dependencies

`npm install --save-dev babel-loader

## Configuration

```
var path = require('path');

const APP_ENTRY = 'app.js'
const BUILD_DIR = '/build/'
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
        	{test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
        ]
    }
};

module.exports = config;
```