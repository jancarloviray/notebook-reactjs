import React from 'react';
import Router from 'react-router';
const { Route, DefaultRoute, RouteHandler, Link } = Router;

export default React.createClass({
    mixins: [Router.State],
    render(){
        return (
            <div className="container">
                <div className="page-header"><h1>Sticky footer with fixed navbar</h1></div>
                <p className="lead">Pin a fixed-height footer to the bottom of the viewport in desktop browsers with this custom HTML and CSS. A fixed navbar has been added with <code>padding-top: 60px;</code> on the <code>body > .container</code>.</p>
                <p>Back to <a href="../sticky-footer">the default sticky footer</a> minus the navbar.</p>
            </div>
        );
    }
});
