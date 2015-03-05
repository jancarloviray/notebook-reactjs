'use strict';

let React = require('react');
let Router = require('react-router');
const { Route, DefaultRoute, RouteHandler, Link } = Router;

module.exports = React.createClass({
    render(){
        return (
            <footer className="footer">
                <div className="container">
                    <p className="text-muted">Place sticky footer content here.</p>
                </div>
            </footer>
        );
    }
});
