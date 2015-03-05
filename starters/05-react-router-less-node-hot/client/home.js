'use strict';

let React = require('react');
let Router = require('react-router');
const { Route, DefaultRoute, RouteHandler, Link } = Router;

module.exports = React.createClass({
    mixins: [Router.State],
    render(){
        return (
            <div className="container">
            </div>
        );
    }
});
