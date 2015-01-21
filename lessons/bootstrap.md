# BOOTSTRAPPING A PROJECT

## package.json

```
npm install --save flux
npm install --save keymirror
npm install --save object-assign
npm install --save react
```

```
npm install --save-dev browserify
npm install --save-dev envify
npm install --save-dev jest-cli
npm install --save-dev reactify
npm install --save-dev uglify-js
npm install --save-dev watchify
```

```
"scripts": {
	"start": "watchify -o js/bundle.js -v -d .",
	"build": "NODE_ENV=production browserify . | uglify -cm > js/bundle.min.js",
	"test": "jest"
}
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

## Add Flux's Dispatcher

```
// AppDispatcher.js
var Dispatcher = require('flux').Dispatcher;
var assign = require('object-assign');

/**
 * A bridge function between the views and the dispatcher, marking the action
 * as a view action.  Another variant here could be handleServerAction.
 * @param  {object} action The data coming from the view.
 */

var AppDispatcher = assign(new Dispatcher(), {
	handleViewAction: function(action){
		this.dispatch({
			source: 'VIEW_ACTION',
			action: action
		});
	}
}
})
```