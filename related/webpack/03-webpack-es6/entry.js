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
