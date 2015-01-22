# Why Webpack?

It works with all kinds of module loading pattern such as CommonJS (require), AMD (requirejs), ES6 and etc. It has lazy loading, is fast and good bower integration.

# Simple Example

```
// terminal
npm install webpack -g

// entry.js
document.write(‘it works!’);

// index.html
<html>
<head></head>
<body>
    <script type=”text/javascript” src=”bundle.js”></script>
</body>
</html>

// terminal
webpack ./entry.js bundle.js

/*
Now open index.html in your browser. It should work
*/

// content.js
module.exports = “It works from content.js!”

// entry.js (update)
document.write(require(‘./content.js’));

// terminal
webpack ./entry.js bundle.js

/*
Now open index.html. It should show “It works from content.js”
webpack will analyze your entry file for dependencies to other files
*/
```
