/**
 * @jsx React.DOM
 */

var React = require('react');

var Note = React.createClass({

    handleEdit:function(id,event){
        event.preventDefault();
        this.props.onEdit(id);
        this.props.onSelect(id);
    },

    render: function() {

        var note=this.props.note;

        var title=note.text.length >= 20 ? note.text.substring(0,20) : note.text;

        var className = this.props.active ? 'active' : null;

        return (
            <a href="#" className={'list-group-item '+className} onClick={this.handleEdit.bind(null,note._id)}>{title}</a>
        )
    }
});

module.exports=Note;