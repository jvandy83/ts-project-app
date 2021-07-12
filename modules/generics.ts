// GENERICS

function identity<T>(args: T): T {
  // console.log(args.length) error T does not have
  // .length
  return args;
}

function identity2<T>(args: T[]): T[] {
  console.log(args.length);
  return args;
}

function identity3<T>(args: Array<T>): Array<T> {
  console.log(args.length);
  return args;
}

// GENERIC FUNCTIONS

function identity4<T>(arg: T): T {
  return arg;
}

let myIdentity: <T>(arg: T) => T = identity4;
let yourIdentity: <U>(arg: U) => U = identity4;

// GENERIC INTERFACE

interface GenericIdentityFn {
  // Type variable inside GenericIdentityFn interface
  <T>(arg: T): T;
}

function identity5<T>(arg: T): T {
  return arg;
}

let thisIdentity: GenericIdentityFn = identity5;

// Move type param up to interface top level

interface GenericIdFn<T> {
  (arg: T): T;
}

function id<T>(args: T): T {
  return args;
}

let myId: GenericIdFn<number> = id;
