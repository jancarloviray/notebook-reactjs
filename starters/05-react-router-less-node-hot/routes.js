'use strict';

let React = require('react');
let Router = require('react-router');

let App = require('./client/app');
let Home = require('./client/home');
let About = require('./client/about');
let Skills = require('./client/skills');

let Route = Router.Route;
let DefaultRoute = Router.DefaultRoute;

let routes = (
    <Route handler={App}>
        <DefaultRoute handler={Home}/>
        <Route name="home" path="/" handler={Home}/>
        <Route name="about" path="about" handler={About}/>
        <Route name="skills" path="skills/:skillName" handler={Skills}/>
    </Route>
);

module.exports = routes;
