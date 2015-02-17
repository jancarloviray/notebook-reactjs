import React from 'react';
import Router from 'react-router';
const { Route, DefaultRoute, RouteHandler, Link } = Router;

export default React.createClass({
    mixins: [Router.State],
    render(){
        return (
            <div className="container">
                <div className="page-header">
                    <h1>{this.getParams().skillName}</h1>
                </div>
            </div>
        );
    }
});
