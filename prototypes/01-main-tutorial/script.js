/** @jsx React.DOM */

/*
 * "props"
 * Using `props` we will be able to read data passed. We access
 * named attributes passed to the component as keys on this.props.
 * To access any nested elements, `this.props.children`.
 * Props are immutable. They are passed from the parent and are
 * "owned" by the parent.
 *
 * "state"
 * To implement interactions, we introduce
 * mutable "state" to the component. `this.state` is private to
 * the component and can be changed by calling `this.setState`
 * When the state is updated, the component re-renders itself.
 *
 * "Think of UIs as simple state machines. By thinking of a UI
 * as being in various states and rendering those states, it is
 * easy to keep your UI consistent."
 *
 * "NOTE: Try to keep as many of your components as possible stateless.
 * By doing this you'll isolate the state to its most logical place
 * and minimize redundancy, making it easier to reason about
 * your application."
 *
 * A common pattern is to create several stateless components
 * that just render data, and have a stateful component above
 * them in the hierarchy that passes its state to its children
 * via props. The stateful component encapsulates all of the
 * interaction logic, while the stateless components take care of
 * rendering data in a declarative way.
 *
 * What Should Go in State?
 * State should contain data that a component's event handlers
 * may change to trigger a UI update.
 *
 * It is important to draw a distinction between the owner-ownee
 * relationship and the parent-child relationship. The
 * owner-ownee relationship is specific to React while the
 * parent-child relationship is simply the one you know and
 * love from the DOM
 */

var converter = new Showdown.converter();

var data = [
  {author: "Pete Hunt", text: "This is one comment"},
  {author: "Jordan Walke", text: "This is *another* comment"}
];

var CommentBox = React.createClass({
    // executes once during the lifecycle of the
    // component and sets up the initial state of the
    // component
    getInitialState: function(){
        return {data: [{author:'Placeholder', text:'Placeholder Text Here!'}]};
    },
    // componentDidMount is a method called automatically
    // by React when a component is rendered. The key to
    // dynamic updates is the call to `this.setState()`. We
    // replace the old array of comments with the new one from
    // the server and the UI automatically updates itself.
    componentDidMount: function(){
        // simulate ajax
        setTimeout(function(){
            this.setState({data:data});
        }.bind(this), 2000);
    },
    // most important method; this returns
    // a tree of React components that will
    // eventually render to HTML
    render: function(){
        // you cannot put reserved javascript
        // keyword such as 'class' thus 'className'
        return (
            <div className='commentBox'>
                Hello! I am a CommentBox!

                <h1>Comments</h1>
                <CommentList data={this.state.data}/>
                <CommentForm />
            </div>
        )
    }
});

var CommentList = React.createClass({
    render: function(){
        var commentNodes = this.props.data.map(function(comment){
            return (
                <Comment author={comment.author}>
                    {comment.text}
                </Comment>
            );
        });
        // author="" is called 'props' or properties
        // using properties, we are able to read the
        // data passed to it
        return (
            <div className='commentList'>
                {commentNodes}
            </div>
        );
    }
});

var CommentForm = React.createClass({
    render: function(){
        return (
            <div className='commentForm'>
                Hello! I am a CommentForm
            </div>
        )
    }
});

var Comment = React.createClass({
    render: function(){
        var rawMarkup = converter.makeHtml(this.props.children.toString());
        // using `this.props` we will be able to read the data passed
        // to it from the CommentList and render some markup
        return (
            <div className='comment'>
                <h2 className='commentAuthor'>
                    {this.props.author}
                </h2>
                <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
            </div>
        );
    }
});

// this instantiates the root components, starts
// the framework and injects the markup intro a
// raw DOM element, provided as the second argument
React.render(
    <CommentBox data={data}/>,
    document.getElementById('content')
)
