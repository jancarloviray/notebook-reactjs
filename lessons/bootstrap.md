# BOOTSTRAPPING A PROJECT

## package.json

### Application Modules

```
# helper files to create the flux architecture
npm install --save flux

# A simple utility for creating an object with values equal to its keys. Identical to react/lib/keyMirror
npm install --save keymirror

# _.extend or a ‘shim’ to Object.assign
npm install --save object-assign

# reactjs utilities and core
npm install --save react
```

### Development Modules

#### Webpack Build

```
# browserify alternative; in fact, better than browserify
npm install --save-dev webpack

# for better live-reload (hot loading)
npm install --save-dev webpack-dev-server

# webpack loader for jsx files
npm install --save-dev jsx-loader

# script for nodejs to watch for code changes, and restart
# your program when it crashes or when a file changes
npm install --save-dev supervisor
```

## webpack-dev-server (better livereload)

http://webpack.github.io/docs/webpack-dev-server.html

The webpack-dev-server is a little node.js express server which uses the webpack-dev-middleware to serve a webpack bundle. It also has a little runtime which is connected to the server via socket.io. The server emits information about the compilation state to the client, which reacts to those events.

NOTE: this should not be run in the backend as production!

```
// webpackDevServer.js

var webpack = require('webpack');
var WebpackDevServer = require('require-dev-server');
var config = require('./webpack.config');
var port = process.env.HOT_LOAD_PORT || 3001;
var compiler = webpack(config)

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
```

## npm run scripts

```
// package.json

“scripts”:{
    // `npm run dev` invokes supervisor to watch for file changes and crashes
    // then reruns the server. It also invokes webpack-dev-server (hot loading).
    “dev”:”NODE_ENV=development node_modules/.bin/supervisor --ignore build/ -e js server & NODE_ENV=development node webpackDevServer.js --progress”
}
```

## (opt) gulp build

```
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

```
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

```
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

```
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

```
var App = require('./components/app.react.js');
var React = require('react');

React.renderComponent(
	<App/>,
	document.body
	//document.getElementById('react');
)
```

## Create Actions (or "Services")

```
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

```
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

```
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

```
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
