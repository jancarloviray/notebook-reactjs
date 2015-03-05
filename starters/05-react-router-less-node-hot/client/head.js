'use strict';

let React = require('react');

let Head = React.createClass({
    render: () => {
        return (
            <head>
                <meta charSet='utf-8'/>
                <meta httpEquiv='X-UA=Compatible' content='IE=edge,chrome=1'/>
                <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'/>
            </head>
        );
    }
});

module.exports = Head;
