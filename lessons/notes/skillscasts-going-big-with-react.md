https://skillsmatter.com/skillscasts/5429-going-big-with-react

NOTES:

- it is better to be predictable than right (interesting..)
- react is great with composition
- each component lives in its own world
- set of state/prop that is limited and defined (i like this...)
- state: questionable variables that are maintained just by inside the variable; it is contained just within the component; great for reusability.
- idempotence: there is an exact, guaranteed mapping between what you put in and what you get out
    - react is immutable by design
    - components do not have ability to manipulate the model (this is great!)
    - gives the guarantee that “bugs are either inside the component or it is not”
- flux stores: defines the and mutates models
    - the only thing that can manipulate models
- view controller: grabs immutable properties and passes it down the components 
