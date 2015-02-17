import React from 'react';
import Router from 'react-router';

var Link = Router.Link;

export default React.createClass({
    render(){
        return (
            <nav className="navbar navbar-default navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="#">Project name</a>
                    </div>
                    <div id="navbar" className="collapse navbar-collapse">
                        <ul className="nav navbar-nav">
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <Link to="skills" params={{skillName:'ReactJS'}}>Skills</Link>
                            </li>
                            <li>
                                <Link to="about">About</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
});
