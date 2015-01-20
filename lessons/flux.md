# FLUX

Flux is an idea for organizing your application that was developed at Facebook, based on one simple principle: 

> "Data moves in one direction through your application."

It is not a framework or a library. It is simply a new kind of architecture that complements React and the concept of *“Unidirectional Data Flow.”*

"Flux is pretty much a made up word to describe “one way” data flow with very specific events and listeners. There is no Flux library but you’ll need the: *Flux Dispatcher* and any JS *event library* such as EventEmitter."

## FLUX IN BRIEF

- Views trigger *actions*, which are just functions that interact with data in some way (for example, you might have an action that fetches data from an API)

- These actions trigger *events* with their resulting data.

- These events are handled by stores which are best thought of as big bundles of application state. *Stores are global singletons* and are usually scoped to a particular concern of your app - for example, FB might have a MessageStore, a UserStore and a FeedStore.

- The callbacks that stores register mutate the store's state, then trigger an "emit" (or change) event, which is listened to by views. This event is intended as the only binding betweeb a store and a view. In a Flux+React application, a component will usually register to this even when mounted, and will re-render any time this event is triggered.

- The most important thing to understand about Flux is that it enforces a separation between calling an action and handling its result. *The result of an action has to go into a store's state - it's never directly communicated back to a view.* The store just triggers an "emit" or a "change" event.

## MISC TIPS

*The View and the Store* should be completely unaware of each other.

In a general sense, *a STORE is somewhat like the model exposed through event messages (akin to routes) the DISPATHCHER is just an EventUtility, ACTIONS are just helpers to expose "store methods" as objects, ACTION CREATORS are just abstractions to actions to simplify calls and for better DRY.*

How to do ASYNC? emit TODO_CREATE_SUCCESS, TODO_CREATE_FAILED along with the payload (and/or error message) instead of promises. Why? Because using promises means the View would have to retain application state, which is against the paradigm.

WHY FLUX? IT IS NOT SIMPLER THAN MVC. IF NOT, IT IS MUCH MORE COMPLICATED THAN MVC. BUT WHY USE IT? 

> *FLUX KEEPS THINGS PREDICTABLE*

The Dispatcher in Flux also ensures that the actions flow through the system one at a time. If an action is sent to the dispatcher before it is finished processing an existing action, it will throw an error.

The Flux architecture pushes/forces the developers to build applications without complicated interactions between data resources (similar to how Angular pushes developers to have better software design by separating logic into services).

In Flux, the Stores contain the entire Application State. Views should never contain application state. It may contain (if necessary), minor UI states for hiding/showing data.

In the Facebook implementation of Flux you can see exactly what causes data to change. Every store includes a list of actions it listens to.

```
// The case statement documents which actions this store listens to
// ...
ThreadStore.dispatchToken = ChatAppDispatcher.register(function(payload) {
  var action = payload.action;
 
  switch(action.type) {
 
    case ActionTypes.CLICK_THREAD:
      _currentID = action.threadID;
      _threads[_currentID].lastMessage.isRead = true;
      ThreadStore.emitChange();
      break;
 
    case ActionTypes.RECEIVE_RAW_MESSAGES:
      ThreadStore.init(action.rawMessages);
      ThreadStore.emitChange();
      break;
 
    default:
      // do nothing
  }
 
});
// ...
```

Similarly, every component maintains a list of which stores it listens to.

```
// Looking at the 'componentDidMount' will usually show
// whic stores this component listens to.
// ...
function getStateFromStores() {
  return {
    threads: ThreadStore.getAllChrono(),
    currentThreadID: ThreadStore.getCurrentID(),
    unreadCount: UnreadThreadStore.getCount()
  };
}
 
var ThreadSection = React.createClass({
 
  getInitialState: function() {
    return getStateFromStores();
  },
 
  componentDidMount: function() {
    ThreadStore.addChangeListener(this._onChange);
    UnreadThreadStore.addChangeListener(this._onChange);
  },
 
  componentWillUnmount: function() {
    ThreadStore.removeChangeListener(this._onChange);
    UnreadThreadStore.removeChangeListener(this._onChange);
  },
// ...
```

## SOME DIFFICULTIES IN FLUX

Every choice in software engineering is a trade-off, and Flux is no exception. We have perceived the following disadvantages:

- It involves writing more boilerplate code
- Migrating existing resources can be a big task
- Unit testing can be difficult without good structure
- Flux does add more files and more lines of code than one might feel are needed to handle the flow of data in an application.

## Individual Components Overview:

- Actions: helper methods that facilitate passing data to the Dispatcher
- Dispatcher: receives actions and broadcasts payload to registered callbacks
- Stores: containers for application state and logic that have callbacks registered to the dispatcher.
- Controller Views: react components that grab the state from stores and pass it down via props to child components

## Flux Flow

https://medium.com/brigade-engineering/what-is-the-flux-application-architecture-b57ebca85b9e

The ToDoApp Component has a form for creating a new ToDo item. When a user submits that form, it kicks off a flow of data through the Flux system.

### 1. The component handles the form submission by calling its own callback

```
// Saving a new ToDo calls the '_onSave' callback
// ...
var Header = React.createClass({
 
  /**
   * @return {object}
   */
  render: function() {
    return (
      <header id="header">
        <h1>todos</h1>
        <TodoTextInput
          id="new-todo"
          placeholder="What needs to be done?"
          onSave={this._onSave}
        />
      </header>
    );
  },
// ...
```

### 2. The component callback calls a method on the ToDoActionCreator.

```
// The '_onSave' callback calls the 'TodoActions' method to create an action
// ...
  /**
   * Event handler called within TodoTextInput.
   * Defining this here allows TodoTextInput to be used in multiple places
   * in different ways.
   * @param {string} text
   */
  _onSave: function(text) {
    if (text.trim()){
      TodoActions.create(text);
    }
 
  }
```

### 3. The ToDoActionCreator creates an action of the type TODO_CREATE

```
// The 'create' method creates an action of type 'TODO_CREATE'
// ...
var TodoActions = {
 
  /**
   * @param  {string} text
   */
  create: function(text) {
    AppDispatcher.handleViewAction({
      actionType: TodoConstants.TODO_CREATE,
      text: text
    });
  },
```

### 4. The action is sent to the Dispatcher.

### 5. The Dispatcher passes the action to all registered callbacks from Stores.

```
// The 'handleViewAction' dispatches the action to all stores.
// ...
var Dispatcher = require('flux').Dispatcher;
var assign = require('object-assign');
 
var AppDispatcher = assign(new Dispatcher(), {
 
  /**
   * A bridge function between the views and the dispatcher, marking the action
   * as a view action.  Another variant here could be handleServerAction.
   * @param  {object} action The data coming from the view.
   */
  handleViewAction: function(action) {
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    });
  }
 
});
// ...
```

### 6. The ToDoStore has a registered callback that listens for the TODO_CREATE action, and updates its own data.

```
// The TodoStore has registered a callback for the 'TODO_CREATE' action.
// ...
/**
 * Create a TODO item.
 * @param  {string} text The content of the TODO
 */
function create(text) {
  // Hand waving here -- not showing how this interacts with XHR or persistent
  // server-side storage.
  // Using the current timestamp + random number in place of a real id.
  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  _todos[id] = {
    id: id,
    complete: false,
    text: text
  };
}
 
// Register to handle all updates
AppDispatcher.register(function(payload) {
  var action = payload.action;
  var text;
 
  switch(action.actionType) {
    case TodoConstants.TODO_CREATE:
      text = action.text.trim();
      if (text !== '') {
        create(text);
      }
      break;
// ...
```

### 7. The ToDoStore fires a change event after updating its data.

```
// TodoStore emits a 'change' event after handling the action.
// ...
// Register to handle all updates
AppDispatcher.register(function(payload) {
  var action = payload.action;
  var text;
 
  switch(action.actionType) {
    case TodoConstants.TODO_CREATE:
      text = action.text.trim();
      if (text !== '') {
        create(text);
      }
      break;
// ...
 
    default:
      return true;
  }
 
  // This often goes in each case that should trigger a UI change. This store
  // needs to trigger a UI change after every view action, so we can make the
  // code less repetitive by putting it here.  We need the default case,
  // however, to make sure this only gets called after one of the cases above.
  TodoStore.emitChange();
 
  return true; // No errors.  Needed by promise in Dispatcher.
});
// ...
```

### 8. The ToDoApp component is listening for change events from the ToDoStore, and re-renders the UI based on the latest data from the ToDoStore.

```
// The component listens for changes and calls the '_onChange' callback
// ...
var TodoApp = React.createClass({
 
  getInitialState: function() {
    return getTodoState();
  },
 
  componentDidMount: function() {
    TodoStore.addChangeListener(this._onChange);
  },
 
  componentWillUnmount: function() {
    TodoStore.removeChangeListener(this._onChange);
  },
// ...
  /**
   * Event handler for 'change' events coming from the TodoStore
   */
  _onChange: function() {
    this.setState(getTodoState());
  }
// ...
```

## Quick Overview of the Flow

### 1. Your Views “Dispatch” “Actions”

A “dispatcher” is essentially an event system. It *broadcasts events* and *registers callbacks*. There is only ever one, global dispatcher. 

“Dispatcher”: noun, a person who oversees the departure of trains, airplanes, buses, etc.
“Dispatch”: verb, to send off or away with speed; to send off promptly to a destination or to perform a task.

Instantiate a Dispatcher

`var AppDispatcher = new Dispatcher()`

Let’s say your application has a “new” button that adds an item to a list.

`<button onClick={ this.createNewItem }>New Item</button>`

What happens on click? Your view dispatches a very specific event, with the event name and new item data.

```
createNewItem: function(evt){
    AppDispatcher.dispatch({
        eventName: ‘new-item’,
        newItem: { name: ‘Marco’ } // sample data
    })
}
```

### 2. Your “Store” Responds to Dispatched Events

Like Flux, “store” is just a word Facebook made up. For our application, we need a specific collection of logic and data for the list. This describes our store. We’ll call it a ListStore.

A store is a singleton, meaning you probably shouldn’t declare it with new. Here, the ListStore is a global object. The application state is maintained here. It also contains the application logic.

```
// global object representing list data and logic
var ListStore = {
    // actual collection
    items: [],
    // accessor methods we’ll use later
    getAll: function(){
        return this.items;
    }
};
```

Now, your store then responds to the dispatched event

```
var ListStore = ...
AppDispatcher.register(function(payload){
    switch(payload.eventName) {
        case ‘new-item’:
            // we get to mutate data
            ListStore.items.push(payload.newItem);
            break;
    }

    return true; // needed for Flux promise resolution
});
```

This is traditionally how Flux does dispatch callbacks. Each payload contains an event name and data. A switch statement decides specific actions.

If, for example, a differnt part of your application needed to keep track of some images and their metadata, you’d make another store and call it ImageStore. *A store represents a single “domain” of your application.*

- *A store is not a model. A store CONTAINS models.*
- *A store is the only thing in your application that knows how to update data.* This is the most important part of Flux. The event we dispatched doesn’t know how to add or remove items.
- *Only your stores are allowed to register dispatcher callbacks!* Your views should never call `AppDispatcher.register`. The dispatcher only exists to send messages from views to stores. Your views will respond to a different kind of event.

### 3. Your Store Emits a “Change” Event

Now that your data is definitely changed, we need to tell the world. *Your store emits an event, but not using the dispatcher*. This might be confusing but it’s the Flux way. Here, let’s give the store the ability to trigger events.

`MicroEvent.mixin(ListStore);`

Let’s trigger our change event:

```
case ‘new-item’:
    ListStore.items.push(payload.newItem);
    // emit the event
    ListStore.trigger(‘change’);
    break;
```

*NOTE: notice that we did not pass the newest item when we trigger. Our views only care that something changed*.

### 4. Your View Responds to the “Change” Event

Now we need to display the list. Our view will completely re-render when the list changes.

*First, lets listen for the `change` even from our ListStore when the component mounts, which is when the component is first created*.

```
componentDidMount: function(){
    ListStore.bind(‘change’, this.listChanged);
}
```

For simplicity’s sake, we’ll just call forceUpdate (not recommended) which triggers a rerender:

```
listChanged: function(){
    this.forceUpdate();
}
```

Don’t forget to clean up your event listeners when your component “unmounts”

```
componentWillUnmount: function(){
    ListStore.unbind(‘change’, this.listChanged);
}
```

Now let’s look at our render function:

```
render: function(){
    var items = ListStore.getAll();
    var itemHtml = items.map(function(listItem){
        // “key” is important and be a unique identifier for each list item
        return <li key={listItem.id}>{listItem.name}</li>;
    });

    return (
        <div>
            <ul>
                {itemHtml}
            </ul>
            <button onClick={this.createNewItem}>New Item</button>
        </div>
    )
}
```

Now we’ve come full circle. When you add a new item, the view **dispatches** an **action**, then the store responds to that action, the store updates, the store triggers a change event and the view responds to the change event by re-rendering.

KEY: *When store data changes, your views should not care if things were added, deleted or modified. They should just re-render entirely. React’s virtual DOM diff algorithm handles the heavy lifting of figuring out which real DOM nodes changed. This makes your life much simpler.*

### What about “Action Creator”?

It pretty much is an abstraction layer to simplify and reduce repetition of methods.

Remember when we click our button, we dispatch a specific event:

```
AppDispatcher.dispatch({
    eventName: ‘new-item’,
    newItem: { name: ‘Samantha’ }
});
```

Well, this can get pretty repetitious to type if many of your views need to trigger this event. Plus all of your views need to know the specific object format.

Flux suggests an abstraction, called *action creators*, which just abstracts the above into a function.

```
ListActions = {
    add: function(item){
        AppDispatcher.dispatch({
            eventName: ‘new-item’,
            newItem: item
        });
    }
}
```

Now your view can just call `ListActions.add({ name: ‘...’ })` and not have to worry about dispatched object syntax.

## The Dispatcher

- The Dispatcher is basically the manager of the entire process. It is the **central hub** for your application. 
- The dispatcher receives actions and dispatchers the actions and data to registered callbacks.

So, it’s essentially pub/sub? **Not exactly**. The dispatcher broadcasts the payload to ALL of its registered callbacks, and includes functionality that allows you to invoke the callbacks in a specific order, even waiting for updates before proceeding. *There is only ever ONE dispatcher, and it acts as the central hub within your application.*

```javascript
var Dispatcher = require(‘flux’).Dispatcher;
// create an instance of the dispatcher
var AppDispatcher = new Dispatcher();

// create handleViewAction to distinguish between
// view triggered actions vs server/api triggered
// actions
AppDispatcher.handleViewAction = function(action){
    // calls dispatch method which will broadcast
    // the action payload to all of its registered
    // callbacks
    this.dispatch({
        source: ‘VIEW_ACTION’,
        action: action
    });
}
module.exports = AppDispatcher;
```

## ASYNC WITH FLUX

http://www.code-experience.com/async-requests-with-react-js-and-flux-revisited/

"Our way of doing async requests sucks. Making the Flux-Stores directly call the api layer and provide a callback is a bad idea in the long run: It's just too hard to reason about the data flow."

## BITS OF TIPS

https://news.ycombinator.com/item?id=7721292

From first-hand experience, **I can say that React+Flux has scaled well to 8+ developers over 800+ JS files and ~60k lines of code in a large single page app here at Facebook.** I'm happy to answer any questions! Some things that we've struggled with:

1. *All data should be kept in stores.* You may have some local component state, but it shouldn't be anything you want to persist if the component is unmounted. We have tried using state several times, and always go back to keeping it in singleton stores. It also works better with the action-dispatcher pattern.

2. Now all your data is in stores, but how do you get it into the specific component that needs it? We started with large top level components which pull all the data needed for their children, and pass it down through props. This leads to a lot of cruft and irrelevant code in the intermediate components. *What we settled on, for the most part, is components declaring and fetching the data they need themselves, except for some small, more generic components.* Since most of our data is fetched asynchronously and cached, we've created mixins that make it easy to declare which data your component needs, and hook the fetching and listening for updates into the lifecycle methods (componentWillMount, etc).

3. *Actions don't have callbacks, as they are by design fire-and-forget. So if you need to be notified when some item has finished being created, for example, you need to listen for the follow up action that the CREATE action fires (yeah, actions firing actions, a bit ugly). Even then, how do you know that CREATE_COMPLETED action correlates to the CREATE that you fired, and not another? Well, actions also come with a payload, so what we ended up doing was passing a context object into the payload and plumbing it all the way down into the CREATE_COMPLETED and CREATE_FAILED actions. Being REALLY STRICT about actions is a major reason why Flux has scaled well for us.*

https://news.ycombinator.com/item?id=7721381

We had talked about using promises at a lower level, but for actions it is very desired for them to be fire and forget. The view (component) fires the action in response to some user interaction (e.g. clicking a button). The action is dispatched, and the stores listen for that action, update themselves, and then "inform", which notifies the component that its data has changed. In the case of data mutations, our action modules end up having a fair amount of logic in them:
1) User clicks a button to favorite an object, lets say an Article 2) View (component) listens for the click handler and calls ArticleActions.favorite(articleID) 3) ArticleActions.favorite fires a preliminary ARTICLE_UPDATE action, for any stores that want to update optimistically 4) ArticleActions.favorite calls into the ArticleDAO (the data access abstraction) via ArticleDAO.update, a function that takes an ID, some updates, and two callbacks, success and error. 5) In the success callback, ArticleActions.favorites fires off ARTICLE_UPDATE_COMPLETED, along with the updated article object 6) In the error callback, ArticleAction.favorites fires off ARTICLE_UPDATE_FAILED, along with the error 7) Stores listen for the COMPLETED and FAILED actions to know when to update their data, including stores that show error notices
As you can see,the action layer itself should not really be accepting callbacks/returning promises. It might be easier, however, if the DAO layer returned promises, and this is something we have talked about migrating to.

---

Q: What's the correct model for communicating with the server?

A: As you say, the models live in stores, so building on my other comment, you would have an ArticleStore that is responsible for providing access to and caching all of the Article objects. As a rule, if you want to mutate data, you do so by calling an action (ArticleActions.update, for example). See my other comment for how the update flow works: https://news.ycombinator.com/item?id=7721381
If you want to fetch data, you go to the store (ArticleStore.getByID, or ArticleStore.query). The ArticleStore will then call into the ArticleDAO (data access abstraction) to fetch data asynchronously, and when it returns the ArticleStore incorporates the data into its cache and "informs", which is basically a pub-sub push (the views/components subscribe to the stores they want to get data from).

---

Q: It's unclear to me why it's important that actions be fire-and-forget. Is there no scenario in which you would want to show (next to the Favorite button) that favoriting failed but not care about other article-update failures?

A: Sure, that is absolutely a valid scenario. This could be accomplished using a context object as I explained in my first comment, something like {changedFields: ['isFavorite'], error: 'some error message'}. You'd then have some store that listens for article update failures and saves the error message somewhere, and then your favorite button view would pull the data from there. *The importance of keeping actions fire-and-forget is that data must live in the store; if actions have callbacks, the views would be using state to keep themselves updated with data that should be in the store.*