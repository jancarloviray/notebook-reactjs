'use strict';

// require('node-jsx').install({ extension: '.js' });

const PORT = process.env.PORT || 3000;
const HOT_LOAD_PORT = process.env.HOT_LOAD_PORT || 3001;

let express = require('express');
let React = require('react');
let Router = require('react-router');
let routes = require('./routes');
let Head = React.createFactory(require('./client/head'));
let Route = Router.Route;
let app = express();

module.exports = app;

app.use('/static', express.static(__dirname + '/static'));

if (process.env.NODE_ENV === 'production') {
    app.use('/build', express.static(__dirname + '/build'));
}

app.use((req, res, next) => {
    // custom router to handle redirect
    let router = Router.create({
        routes: routes,
        location: req.path,
        onAbort: (abortReason, location) => {
            if (abortReason && abortReason.to) {
                res.redirect(301, abortReason.to);
            } else {
                res.redirect(404, '404');
            }
        }
    });

    let content = '';

    router.run((Handler, state) => {
        content = React.renderToString(React.createElement(Handler, {
            routerState: state,
            environment: 'server'
        }), null);
    });

    res.write('<html>');
    res.write(React.renderToStaticMarkup(Head()));
    res.write('<body>');
    res.write(content);
    res.write('</body>');

    // in dev, compiled js is in dev-server, so we get that
    if (process.env.NODE_ENV === 'development') {
        res.write('<script src="http://localhost:' + HOT_LOAD_PORT + '/build/client.js" defer></scripts>');
    }

    // in prod, it should have been 'built'
    if (process.env.NODE_ENV === 'production') {
        res.write('<script src="/build/client.js" defer></scripts>');
    }

    res.write('</html>');
    res.end();
});

app.listen(PORT);

if (process.env.NODE_ENV === 'development') {
    console.log('Server is listening on port ' + PORT);
}
