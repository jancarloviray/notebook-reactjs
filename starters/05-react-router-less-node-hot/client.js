let React = require('react');
let routes = require('./routes');

Router.run(routes, (Handler) => React.render(<Handler/>, document.body));
