abstract class Person {
  name: String;
  constructor(name: string) {
    this.name = name;
  }
  display(): void {
    console.log(this.name);
  }

  abstract find(string: string): Person;
}

class Employee extends Person {
  empCode: number;
  constructor(name: string, empCode: number) {
    super(name);
    this.empCode = empCode;
  }
  find(name: string) {
    return new Employee(name, 1);
  }
}

var emp1 = new Employee('James', 100);
console.log(emp1.find('Jim'));
console.log(emp1);
