# Bootstrapping an Isomorphic Application

Goal for this project is to create an Isomorphic Application with ReactJS with line-by-line explanation.

## Requirements

- [ReactJS](facebook.github.io/react/) - client/server-side view
- [Flux](https://github.com/facebook/flux) - facebook/flux, the architecture for react
- [Gulp](https://github.com/gulpjs/gulp) - general build; might not be needed
- [Webpack](https://github.com/webpack/webpack) - js/jsx build and more
- [Webpack Dev Server](https://github.com/webpack/webpack-dev-server) - for “Hot Loading” - a better livereload
- [ExpressJS](https://github.com/expressjs) - minimal server
- [Docker](https://github.com/docker/docker) - for isolated containers like Heroku
- Testing Framework (?)

## Table of Contents

- Directory Setup (build, dist, client, server, test)
- Required Application Modules
- Required Development Modules
- Hot Reload Setup
- JS/JSX Build System with Watch

TODO:
- Initial Server Bootstrap with Express and Supervisor
- Initial Client Bootstrap with ReactJS
- Router
- Flux Architecture
- Automated Testing
- Docker Integration
- CSS/LESS Build System with Watch
- Environment Specific Build System (production/development)

FUTURE:
- productionize this
- example app
- maybe, yahoo/fluxible integration as separate project

## Directory Setup

```
/build
/client
/server
package.json
webpack.config.js
```

## Required Modules

### Application Modules

```bash
# CLIENT/SERVER: CORE
# -------------------

# flux architecture helpers
npm install --save flux

# reactjs core
npm install --save react

# react router
npm install --save react-router

# CLIENT/SERVER: REACT HELPERS

# document title helper
npm install --save react-document-title

# CLIENT/SERVER: UTILITIES
# ------------------------

# A simple utility for creating an object with values equal to its keys. Identical to react/lib/keyMirror
npm install --save keymirror

# _.extend or a ‘shim’ to Object.assign
npm install --save object-assign

# ua parser
npm install --save ua-parser-js

# date helpers
npm install --save moment

# SERVER: CORE
# ------------

# node server
npm install --save express

# SERVER: UTILITIES
# -----------------

# utility - allows requiring jsx files
npm install --save node-jsx

# SERVER: MIDDLEWARES
# -------------------

# parses request body
npm install --save body-parser

# gzip/deflate compression
npm install --save compression

# cors setup
npm install --save cors
```

### Development Modules

#### Webpack Build

```bash
# browserify alternative; has more features than browserify
npm install --save-dev webpack

# for better live-reload (hot loading)
npm install --save-dev webpack-dev-server

# script for nodejs to watch for code changes, and restart your program when it crashes or when a file changes
npm install --save-dev supervisor

# es6 to es5
npm install --save-dev 6to5-core

# webpack loader for 6to5
npm install --save-dev 6to5-loader

# webpack loader for jsx files
npm install --save-dev jsx-loader

# a nice module that allows hot loading with react
npm install --save-dev react-hot-loader

# a set of complementary tools to React, including the JSX transformer
npm install --save-dev react-tools
```

## Hot Reload (better livereload)

http://webpack.github.io/docs/webpack-dev-server.html

The webpack-dev-server is a little node.js express server which uses the webpack-dev-middleware to serve a webpack bundle. It also has a little runtime which is connected to the server via socket.io. The server emits information about the compilation state to the client, which reacts to those events.

NOTE: this should not be run during production!

```javascript
// webpackDevServer.js

var webpack = require('webpack');
var WebpackDevServer = require('require-dev-server');
var config = require('./webpack.config');
var port = process.env.HOT_LOAD_PORT || 3001;
var compiler = webpack(config)

new WebpackDevServer(compiler, {
    // webpack-dev-server options
    // --------------------------

    // Base path for the content. Can be file, directory or url.
    contentBase: 'http://localhost:3000',
    // Important for 'hot module replacement'.
    hot: true

    // webpack-dev-middleware options
    // ------------------------------

    // The path where to bind the middleware to the server. In most cases, this equals the webpack configuration options `output.publicPath`
    publicPath: config.output.publicPath,
    // only warnings and errors will be displayed to console
    noInfo: true,
    // the delay after a change
    watchDelay: 100
}).listen(port, 'localhost', function(err, result){
    if(err){ console.error(err); }
    console.log('WebpackDevServer listening at localhost:' + port);
});
```

## npm run scripts

```javascript
// package.json

“scripts”:{
    // `npm run dev` invokes supervisor to watch for file changes and crashes then reruns the server. This command also invokes webpack-dev-server (hot loading).
    “dev”:”NODE_ENV=development node_modules/.bin/supervisor --harmony --ignore build/ -e js server & NODE_ENV=development node webpackDevServer.js --progress”,
    “start”:”NODE_ENV=production node --harmony server”
}
```

## webpack.config.js

```javascript
var webpack = require('webpack');
var path = require('path');

// part of webpack's dependency injection. This defines free variables. it is useful for having development build with debug logging or adding global constants.
// http://webpack.github.io/docs/list-of-plugins.html#defineplugin
// var definePlugin = new webpack.DefinePlugin({ IS_CLIENT: 'true' });

var config = {

    // cache generated modules and chunks to improve performance for multiple incremental builds. This is enabled by default in watch mode.

    cache: true,

    resolve: {
        // an array of extension that should be used to resolve modules. This allows to omit extensions when requiring files.
        extensions: ['', '.js']
    },

    // the entry point for the bundle. If you pass a string, the string resolves to a module which is loaded upon startup. If you pass an array, all modules are loaded upon startup and the last one is exported. If you pass an object, multiple entry bundles are created.
    // http://webpack.github.io/docs/configuration.html#entry

    entry: [
        // These are for hot-module-replacement or HMR. This is an experimental feature but is usable.
        // http://webpack.github.io/docs/hot-module-replacement-with-webpack.html
        'webpack-dev-server/client?http://localhost:3001',
        'webpack/hot/dev-server',

        // entry point
        './client.js'
    ],

    // options affecting the output
    output: {
        // the output directory as absolute path. This is where to put build results when doing production builds.
        path: path.join(__dirname, '/build/')

        // the filename of the chunk as relative path inside the output.path directory. Note that you must NOT specify an absolute path here. Use the output.path option.
        // [name] is replaced by name of chunk.
        // [hash] is replace by hash of compilation
        // [chunkhash] is replaced by hash of chunk
        //
        // here, the output will be on /build/client.js so you must include <script src='/build/client.js' defer>... in your index.
        filename: 'client.js',

        // the output.path from the javascript perspective. If you do not know the publicPath while compiling, you can omit it and set __webpack_public_path__ on runtime. This will be the path to use in HTML
        // this is for development mode, so if NODE_ENV === 'development', add this: <script src='http://localhost:3001/build/client.js'...
        publicPath: 'http://localhost:3001/build/'
    },

    // plugins are included in your module by using the plugins propery here
    plugins: [
        // enables hot module replacement
        new webpack.HotModuleReplacementPlugin(),
    ],

    module: {
        // an array of automatically applied loaders. Each item can have these properties:
        // test: a condition that must be met
        // exclude: a condition that must not be met
        // include: a condition that must be met
        // loader: a string of '!' separated loaders
        // loaders: an array of loaders as string
        loaders: [
            // NOTE: the loaders here are resolved to the resources which they are applied to. This means that they are not resolved relative to the configuration file. Loaders are just modules that export a function with a parameter that accepts the content of files that match the test.
            // NOTE: If you have loaders installed from npm and your node_modules folder is not part of the parent folder of all source files, webpack cannot find the loader. You need to add node_modules as absolute path to the `resolveLoader.root` option. {resolveLoader:{root:path.join(__dirname,'node_modules')}}
            // Here, we pass .js files through react-hot and jsx-loader transforms.
            {test: /\.js$/, loaders: ['react-hot','6to5-loader','jsx?harmony']},
            {test: /\.json$/, loaders: ['json']}
        ]
    }
};

if(process.env.NODE_ENV === 'development'){
    // choose a developer tool to enhance debugging. eval: each module is executed with eval and //@sourceUrl
    config.devtool = 'eval';
}

module.exports = config;
```

## (opt) gulp build

```javascript
npm install --save-dev gulp gulp-concat gulp-uglify gulp-react gulp-html-replace
npm install --save-dev source browserify watchify reactify streamify

//gulpfile.js
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var streamify = require('gulp-streamify');

var path = {
	HTML: 'src/index.html',
	MINIFIED_OUT: 'build.min.js',
	OUT: 'build.js',
	DEST: 'dist',
	DEST_BUILD: 'dist/build',
	DEST_SRC: 'dist/src',
	ENTRY_POINT: './src/js/App.js'
};

gulp.task('copy', function(){
	gulp.src(path.HTML)
	.pipe(gulp.dest(path.DEST));
});

gulp.task('watch', function() {
	// The very first thing we do is tell Gulp to watch 
	// our index.html file for any changes and if 
	// something does change, run the copy task.
	gulp.watch(path.HTML, ['copy']);

	// The next thing we do is set up a watcher. 
	// Watchify works very closely with Browserify. 
	// A problem that was occurring with 
	// these Browserify/React build processes 
	// was that Browserify would take forever 
	// to transpile because it was going through 
	// every component every single time anything 
	// changed and would re-update the 
	// new bundled file. Watchify fixes this. 
	// Instead of going through every file, 
	// Watchify will cache your files and 
	// only update the ones that need to be updated. 
	// This makes builds take a LOT less time.
	var watcher  = watchify(browserify({
		// one perk with browserify is that you 
		// just tell it the entry point or the main 
		// component in your app and it will 
		// take care of all the child components
		entries: [path.ENTRY_POINT],

		// Next we have the transform property. 
		// Browserify works with more than just React. 
		// Here is where we tell Browserify how 
		// to transform our code.
		transform: [reactify],

		// his tells Browserify to use source maps. 
		// What source maps do is even though we’re 
		// referencing the transpiled JSX in our 
		// index.html page, through source maps 
		// when there is an error in our code, the 
		// error will point to the line number in 
		// our JSX file rather than our transpiled JS file. 
		debug: true,

		// watchify website just states that 
		// these are needed in order to use watchify.
		cache: {}, packageCache: {}, fullPaths: true
	}));

	// The next thing we’re going to do is set up 
	// our watcher to watch for updates in our 
	// parent component or in any of its children 
	// components. We tell our watcher to watch 
	// for updates then we pass it a callback 
	// function to invoke whenever there is an update.
	return watcher.on('update', function () {
		watcher.bundle()
		.pipe(source(path.OUT))
		.pipe(gulp.dest(path.DEST_SRC))
		console.log('Updated');
	})
	.bundle()
	.pipe(source(path.OUT))
	.pipe(gulp.dest(path.DEST_SRC));
});

// production
gulp.task('build', function(){
  browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify],
  })
    .bundle()
    .pipe(source(path.MINIFIED_OUT))
    .pipe(streamify(uglify(path.MINIFIED_OUT)))
    .pipe(gulp.dest(path.DEST_BUILD));
});
```

## structure

```
/css
/js
	/actions
	/components
	/constants
	/dispatcher
	/stores
app.js
index.html
package.json
```

## index.html

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Out Of Line</title>
</head>	
<body>
<section id="react"></section>
<script src="js/bundle.js"></script>
</body>
</html>
```

## Add Flux Dispatcher

```javascript
// js/dispatcher/AppDispatcher.js

var Dispatcher = require('flux').Dispatcher;

// merge/extend library
var assign = require('object-assign');

var AppDispatcher = assign(new Dispatcher(), {

	/**
	* @param {object} action The details of the action, including the actions
	* type and additional data coming from the server.
	*/

	handleServerAction: function(action) {
		var payload = {
			source: 'SERVER_ACTION',
			action: action
		};
		this.dispatch(payload);
	},

	/**
	* A bridge function between the views and the dispatcher, marking the action
	* as a view action.  Another variant here could be handleServerAction.
	* @param  {object} action The data coming from the view.
	*/

	handleViewAction: function(action){
		this.dispatch({
	 		source: 'VIEW_ACTION',
	 		action: action
	 	});
	}

});

module.exports = AppDispatcher;
```

## Create the App

```javascript
// js/components/app.react.js
var React = require('react');
var App = React.createClass({
	render: function(){
		return (
			<div className="outlineapp">Test</div>
		);
	}
});

module.exports = App;
```

## Create Entry Point (client)

```javascript
var App = require('./components/app.react.js');
var React = require('react');

React.renderComponent(
	<App/>,
	document.body
	//document.getElementById('react');
)
```

## Create Actions (or "Services")

```javascript
var AppDispatcher = require('../dispatcher/AppDispatcher');
var TodoConstants = require('../constants/TodoConstants');

var TodoActions = {

  /**
   * @param  {string} text
   */

  create: function(text) {
    AppDispatcher.dispatch({
      actionType: TodoConstants.TODO_CREATE,
      text: text
    });
  },

  /**
   * @param  {string} id The ID of the ToDo item
   * @param  {string} text
   */

  updateText: function(id, text) {
    AppDispatcher.dispatch({
      actionType: TodoConstants.TODO_UPDATE_TEXT,
      id: id,
      text: text
    });
  },

  /**
   * Toggle whether a single ToDo is complete
   * @param  {object} todo
   */

  toggleComplete: function(todo) {
    var id = todo.id;
    if (todo.complete) {
      AppDispatcher.dispatch({
        actionType: TodoConstants.TODO_UNDO_COMPLETE,
        id: id
      });
    } else {
      AppDispatcher.dispatch({
        actionType: TodoConstants.TODO_COMPLETE,
        id: id
      });
    }
  },

  /**
   * Mark all ToDos as complete
   */

  toggleCompleteAll: function() {
    AppDispatcher.dispatch({
      actionType: TodoConstants.TODO_TOGGLE_COMPLETE_ALL
    });
  },

  /**
   * @param  {string} id
   */

  destroy: function(id) {
    AppDispatcher.dispatch({
      actionType: TodoConstants.TODO_DESTROY,
      id: id
    });
  },

  /**
   * Delete all the completed ToDos
   */

  destroyCompleted: function() {
    AppDispatcher.dispatch({
      actionType: TodoConstants.TODO_DESTROY_COMPLETED
    });
  }

};

module.exports = TodoActions;
```

## Add a Store and Register it with the Dispatcher 

```javascript
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var TodoConstants = require('../constants/TodoConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _todos = {};

/**
 * Create a TODO item.
 * @param  {string} text The content of the TODO
 */
function create(text) {
  // Hand waving here -- not showing how this interacts with XHR or persistent
  // server-side storage.
  // Using the current timestamp + random number in place of a real id.
  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  _todos[id] = {
    id: id,
    complete: false,
    text: text
  };
}

/**
 * Update a TODO item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(id, updates) {
  _todos[id] = assign({}, _todos[id], updates);
}

/**
 * Update all of the TODO items with the same object.
 *     the data to be updated.  Used to mark all TODOs as completed.
 * @param  {object} updates An object literal containing only the data to be
 *     updated.

 */
function updateAll(updates) {
  for (var id in _todos) {
    update(id, updates);
  }
}

/**
 * Delete a TODO item.
 * @param  {string} id
 */
function destroy(id) {
  delete _todos[id];
}

/**
 * Delete all the completed TODO items.
 */
function destroyCompleted() {
  for (var id in _todos) {
    if (_todos[id].complete) {
      destroy(id);
    }
  }
}

var TodoStore = assign({}, EventEmitter.prototype, {

  /**
   * Tests whether all the remaining TODO items are marked as completed.
   * @return {boolean}
   */
  areAllComplete: function() {
    for (var id in _todos) {
      if (!_todos[id].complete) {
        return false;
      }
    }
    return true;
  },

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAll: function() {
    return _todos;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  var text;

  switch(action.actionType) {
    case TodoConstants.TODO_CREATE:
      text = action.text.trim();
      if (text !== '') {
        create(text);
      }
      TodoStore.emitChange();
      break;

    case TodoConstants.TODO_TOGGLE_COMPLETE_ALL:
      if (TodoStore.areAllComplete()) {
        updateAll({complete: false});
      } else {
        updateAll({complete: true});
      }
      TodoStore.emitChange();
      break;

    case TodoConstants.TODO_UNDO_COMPLETE:
      update(action.id, {complete: false});
      TodoStore.emitChange();
      break;

    case TodoConstants.TODO_COMPLETE:
      update(action.id, {complete: true});
      TodoStore.emitChange();
      break;

    case TodoConstants.TODO_UPDATE_TEXT:
      text = action.text.trim();
      if (text !== '') {
        update(action.id, {text: text});
      }
      TodoStore.emitChange();
      break;

    case TodoConstants.TODO_DESTROY:
      destroy(action.id);
      TodoStore.emitChange();
      break;

    case TodoConstants.TODO_DESTROY_COMPLETED:
      destroyCompleted();
      TodoStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = TodoStore;
```

## Write the View and tie the actions

```javascript
/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the TodoStore and passes the new data to its children.
 */

var Footer = require('./Footer.react');
var Header = require('./Header.react');
var MainSection = require('./MainSection.react');
var React = require('react');
var TodoStore = require('../stores/TodoStore');

/**
 * Retrieve the current TODO data from the TodoStore
 */
function getTodoState() {
  return {
    allTodos: TodoStore.getAll(),
    areAllComplete: TodoStore.areAllComplete()
  };
}

var TodoApp = React.createClass({

  getInitialState: function() {
    return getTodoState();
  },

  componentDidMount: function() {
    TodoStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    TodoStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {
  	return (
      <div>
        <Header />
        <MainSection
          allTodos={this.state.allTodos}
          areAllComplete={this.state.areAllComplete}
        />
        <Footer allTodos={this.state.allTodos} />
      </div>
  	);
  },

  /**
   * Event handler for 'change' events coming from the TodoStore
   */
  _onChange: function() {
    this.setState(getTodoState());
  }

});

module.exports = TodoApp;
```

```javascript
var React = require('react');
var ReactPropTypes = React.PropTypes;
var TodoActions = require('../actions/TodoActions');
var TodoItem = require('./TodoItem.react');

var MainSection = React.createClass({

  propTypes: {
    allTodos: ReactPropTypes.object.isRequired,
    areAllComplete: ReactPropTypes.bool.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    // This section should be hidden by default
    // and shown when there are todos.
    if (Object.keys(this.props.allTodos).length < 1) {
      return null;
    }

    var allTodos = this.props.allTodos;
    var todos = [];

    for (var key in allTodos) {
      todos.push(<TodoItem key={key} todo={allTodos[key]} />);
    }

    return (
      <section id="main">
        <input
          id="toggle-all"
          type="checkbox"
          onChange={this._onToggleCompleteAll}
          checked={this.props.areAllComplete ? 'checked' : ''}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul id="todo-list">{todos}</ul>
      </section>
    );
  },

  /**
   * Event handler to mark all TODOs as complete
   */
  _onToggleCompleteAll: function() {
    TodoActions.toggleCompleteAll();
  }

});

module.exports = MainSection;
```

## Inspirations

- [React-Isomorphic-Seed](https://github.com/htmlxprs/React-Isomorphic-Seed)
- [isomorphic-react-template](https://github.com/gpbl/isomorphic-react-template)
- [react-starter-kit](https://github.com/kriasoft/react-starter-kit)
- [isomorphic-hot-loader](https://github.com/irvinebroque/isomorphic-hot-loader)
- [jlongster.com](http://jlongster.com/Blog-Rebuild--Build-Systems---Cross-Compiling)
- [jlogster/blog](https://github.com/jlongster/blog)

## Credits

by Jan Carlo Viray
