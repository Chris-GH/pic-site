function person1(name,age){
    this.name=name;
    this.age = age;
};

let p1 = new person1("gh",18);
console.log(p1.age);