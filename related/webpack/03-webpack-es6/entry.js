import Person from './Person.js';

class Employee extends Person {
    constructor(name='Jan Carlo', title='Software Engineer'){
        super(name);
        this.title = title;
    }

    info(){
        return this.name + ', ' + this.title;
    }
}

var jc = new Employee();
console.log(jc.info());

// promises example
var p1 = new Promise((resolve, reject) => setTimeout(resolve, 400, "one"));
var p2 = new Promise((resolve, reject) => setTimeout(resolve, 200, "two"));
Promise.all([p1, p2]).then(function(value) {
    console.log(value); //one, two
});
