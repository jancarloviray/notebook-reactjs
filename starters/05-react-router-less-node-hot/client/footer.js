import React from 'react';
import Router from 'react-router';
const { Route, DefaultRoute, RouteHandler, Link } = Router;

export default React.createClass({
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
