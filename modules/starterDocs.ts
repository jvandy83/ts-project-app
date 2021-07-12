let isDone: boolean = false;

let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;

let color: string = 'red';

let numberList: number[] = [1, 2, 3, 4];

// GENERIC ARRAY TYPE
let genericNumList: Array<number> = [1, 2, 3];
let genericStrList: Array<string> = ['a', 'b', 'c'];

let stringList: string[] = ['a', 'b', 'c'];

// TUPLES
let tuple: [string, number] = ['a', 2];

enum Color {
  Green,
  Red,
  Blue,
}

var someValue: any = 'this is a string';

// let strLength: number = (<string>someValue).length;
// ...is equal to:
let strLength: number = (someValue as string).length;

// function printLabel( labeledObj: { label: string }) {
//   console.log(labeledObj.label);
// }
// let myObj = { size: 10, label: 'Size 10 Object'};
// printLabel(myObj);

interface LabeledValue {
  label: string;
}

function printLabel(labeledObj: LabeledValue) {
  console.log(labeledObj.label);
}
let myObj = { size: 10, label: 'Size 10 Object' };
printLabel(myObj);

let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;

interface SquareConfig {
  color?: string;
  width?: number;
  [prop: string]: any;
}
function createSquare(config: SquareConfig): { color: string; area: number } {
  return { color: config.color || 'red', area: config.width || 20 };
}

let mySquare = createSquare({ colour: 'red', width: 20 });

interface StringArray {
  [index: number]: string;
}

let myArray: StringArray;
myArray = ['red', 'blue'];

let myStr: string = myArray[0];

interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

interface F {
  [x: string]: Dog;
}
// Error: indexing with a numeric string might get you a completely separate type of Animal!

interface NumberDictionary {
  [index: string]: number;
  length: number;
  name: string;
}

interface NumberOfStringDictionary {
  [index: string]: string | number;
  length: number;
  name: string;
}

interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
}

class Clock implements ClockInterface {
  currentTime: Date = new Date();
  setTime(d: Date) {
    this.currentTime = d;
  }
  constructor(h: number, m: number) {}
}
