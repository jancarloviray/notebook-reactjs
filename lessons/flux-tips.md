# FLUX TIPS

- The *store* is the only piece of application flow that is tasked with mutating state data.

- "single source of truth" means that we don't keep copies of state data in various parts of our application that we have to then worry about keeping synchronized.

- react components should be as stateless as possible; this leads to creation of rather "dumb" components which: generally receive all of their state data via DOM attributes AND do not directly mutate data.

- flux stores should expose EventEmitter actions like emitChange, addListener, removeListener and it should expose functions to access private data. EventEmitter and data accessor methods are used by view components. The store also needs to emit a change event to its listeners whenever any of its private data changes.

- The store is the part of the application which is responsiple for business logic. An app of any size will have multiple, possibly interdependent, stores. When a store responds to a user action, it may persist data to a database (probably via some restful endpoint), run a calculation or any other business logic. After a store is done, it should emits an event to which views can respond.

- A Store is simply a JavaScript Object modeled as a Singleton. It stores state and business logic to access and manipulate that state. It also has an EventEmitter mixed in (npmjs.com/package/events) so views can register to changes

- http://stackoverflow.com/questions/23591325/in-flux-architecture-how-do-you-manage-store-lifecycle?rq=1