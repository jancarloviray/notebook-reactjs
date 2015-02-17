# Starter Steps

## Install Webpack

`npm init`
`npm install webpack -g` to install webpack globally
`npm install --save-dev webpack` to install project version

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

## Install ES6 transpiler

`npm install --save-dev babel-loader

## Configuration

```javascript
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
```

## Install Webpack Dev Server

`npm install webpack-dev-server -g`
`npm install --save-dev webpack-dev-server`

## Append to package.json run

```javascript
"scripts": {
    "dev": "webpack-dev-server --devtool eval --progress --colors --hot --content-base build"
  }
```

**webpack-dev-server** starts a webservice on localhost:8080

**--devtool eval** creates source url for your code, allowing you to pinpoint by filename and line number when errors occur

**--content-base build** points to the output directory configured

## Run the webdev server

`open http://localhost:8080`

## HTML

```html
<!doctype html>
<html>
    <head></head>
    <body>
        <script type="text/javascript" src="http://localhost:8080/webpack-dev-server.js"></script>
        <script type="text/javascript" src="build/bundle.js"></script>
    </body>
</html>
```

## Install React

`npm install --save react`

## Use ReactJS in the code

```
import React from 'react';

export default React.createClass({
  render: function () {
    return React.createElement('h1', null, 'Hello world');
  }
});
```

