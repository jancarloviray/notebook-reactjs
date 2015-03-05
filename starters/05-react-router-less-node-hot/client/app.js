'use strict';

// require('bootstrap');
// require('./styles/app.less');

let React = require('react');
let Router = require('react-router');
let Footer = require('./footer');
let Navbar = require('./navbar');

const { Route, DefaultRoute, RouteHandler, Link } = Router;

let App = React.createClass({
    render(){
        return(
            <div className="app">
                <Navbar/>
                    <RouteHandler/>
                <Footer/>
            </div>
        );
    }
});

module.exports = App;

/*
ERROR: "The following modules couldn't be hot updated: (They would need a full reload!)"
If you get this warning when editing a root component, this may be because you don't export anything from it, and call React.render from there. Put your root component in a separate file (e.g. App.jsx) and require it from index.js where you call React.render.
This warning may also appear if you edit some non-component file which is required from files other than components. This means hot update bubbled up, but the app couldn't handle it. This is normal! Just refresh.
*/
