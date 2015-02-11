'use strict';

// transparently require() jsx from node
require('node-jsx').install({extension:'.js'});

// node modules
var compression = require('compression');
var UAParser = require('ua-parser-js');
var express = require('express');
var path = require('path');
var cors = require('cors');

// view component
var React = require('react');

// client/server-side router
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var routes = require('./routes');

// react components
var Head = React.createFactory(require('./components/Head'));
var ReactDocumentTitle = require('react-document-title');

// setup the express server
var server = express();
server.use(compression());

/**
 * Static Files Setup
 */

// serve the static directory for application codes
if(process.env.NODE_ENV === 'production'){
    server.use('/build', express.static(path.join(__dirname, '/build')));
}

// serve static assets such as images, videos, etc
server.use('/static', express.static(path.join(__dirname, '/static')));

// setup CORS
server.use(cors());

// handle all other incoming requests
server.use(function(req, res, next){

    // customize Router to handle redirect
    var router = Router.create({
        routes: routes,
        location: req.path,
        onAbort: function defaultAbortHandler(abortReason, location){
            if(abortReason && abortReason.to){
                res.redirect(301, abortReason.to);
            } else {
                res.redirect(404, '404');
            }
        }
    });

    var content = '';

    // run the router and render the result to string

    // CLIENT: Router.run(routes, Router.HistoryLocation /*HTML5*/, function(Handler, state){
    // SERVER: router.run(function(Handler, state){
    router.run(function(Handler, state){

        // CLIENT: React.render(
        // SERVER: React.renderToString(
        content = React.renderToString(

            // CLIENT: <Handler routerState={state} environment="browser"/>, document.body
            // SERVER: React.createElement(Handler, { routerState: state, environment: 'server' }), null
            React.createElement(Handler, { routerState: state, environment: 'server' }), null
        );
    });

    // Must call this in server after rendering components to string to retrieve the title given to the most innermost DocumentTitle. Because this component keeps track of mounted instances, you have to make sure to call rewind on server or you'll get memory leak.
    var title = ReactDocumentTitle.rewind();

    // Render <head> to string
    var head = React.renderToStaticMarkup(Head({title: title}));

    // Write the response
    res.write('<html>');
    res.write(head);
    res.write('<body/>');
    res.write(content);
    res.write('</body>');

    // In development, the compiled JS is served by WebpackDevServer (so we can do 'hot loading'). Must add the path for that
    if(process.env.NODE_ENV === 'development') {
        res.write('<script src="http://localhost:3001/build/client.js" defer></script>');
    }

    if(process.env.NODE_ENV === 'production') {
        res.write('<script src="/build/client.js" defer></script');
    }

    res.write('</html>');
    res.end();

});

var port = process.env.PORT || 8080;
server.listen(port);

if(process.env.NODE_ENV === 'development') {
    console.log('Server is listening to port: ' + port);
}
