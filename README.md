# catch-match

## Motivation

## Java example

```java
try {
    ...
} catch (ExceptionClass1 e) {
   ....
} catch (ExceptionClass2, ExceptionClass3 e) {
   ....
} catch (any) {
  ...
} finally {
  ....
}
```

## Example 1
```javascript
const result = _try(context => {
    context.tmp = 'any context data';
    console.log('start', context);
    return [1, 2, 3, 4, 5]; // value
}).catch(SyntaxError, (context) => {
    // noop
}).catch([TypeError, ReferenceError], (context) => {
    // noop
}).other((error, context) => {
    // noop
}).finally(({value, context, error}) => {
    // value: [1, 2, 3, 4, 5] 
    // context: {tmp: 'any context data'}
    // error: undefined
    if (!error) {
      return value.reverse();
    }
});

console.log(result); 
// {
//     value: [5, 4, 3, 2, 1] 
//     context: {tmp: 'any context data'}
//     error: undefined
// } 

```

## Example 2
```javascript
const result = _try(context => {
  context.tmp = 'any context data';
  console.log('start', context);
  // ...
  throw ReferenceError;
}).catch(SyntaxError, (context) => {
  // noop
}).catch([TypeError, ReferenceError], (context) => {
  // context: {tmp: 'any context data'}
}).other((error, context) => {
  // noop
}).finally(({value, context, error}) => {
  // value: undefined 
  // context: {tmp: 'any context data'}
  // error: ReferenceError
  if (!error) {
    return value.reverse();
  }
});

console.log(result); 
// {
//     value: undefined 
//     context: {tmp: 'any context data'}
//     error: ReferenceError
// } 

```

## Example 3
```javascript
const result = _try(context => {
  context.tmp = 'any context data';
  console.log('start', context);
  // ...
  throw SyntaxError;
}).catch([TypeError, ReferenceError], (context) => {
  // noop
}).other((error, context) => {
  // error: SyntaxError
  // context: {tmp: 'any context data'}
  context.unexpectedError = true;
}).finally(({value, context, error}) => {
  // value: undefined 
  // context: {tmp: 'any context data', unexpectedError: true}
  // error: SyntaxError
  if (!error) {
    return value.reverse();
  }
});

console.log(result); 
// {
//     value: undefined 
//     context: {tmp: 'any context data', unexpectedError: true}
//     error: SyntaxError
// } 

```
