/** @jsx React.DOM */

/*
 * You simply pass your event handler as a camelCased prop
 * similar to how you'd do in HTML. React ensures IE8
 * behavior  as well.
 *
 * To use in touch devices, enable this:
 * React.initializeTouchEvents(true)
 */

var LikeButton = React.createClass({
    getInitialState: function(){
        return {liked:false};
    },
    handleClick: function(event){
        this.setState({liked: !this.state.liked});
    },
    render: function(){
        var text= this.state.liked ? 'liked' : 'havent liked';
        return (
            <p onClick={this.handleClick}>
                You {text} this. Click to toggle
            </p>
        )
    }
});

React.render(
    <LikeButton />,
    document.body
);
