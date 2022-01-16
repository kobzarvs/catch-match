# catch-match
![image](https://user-images.githubusercontent.com/1615093/149611056-ad5f8c6c-d7fe-4a64-aed4-a1763135e7ee.png)

## Motivation

### java
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

### javascript
```javascript
try {
  error; // error intruction
} catch (err) {
  switch(err.constructor) {
    case ReferenceError:
    case SyntaxError:
      console.error(`${err.constructor.name}: ${err.message}`);
      break;
    default:
      console.error('other error:', err);
  }
} finally {
  console.log('final')
}

//> ReferenceError: error is not defined
//> final
```

## Features

Supporting sync/async functions

## Getting started

```shell
yarn add catch-match

or 

npm install catch-match
```

```javascript
import $try from 'catch-match';
// or
import { $try } from 'catch-match';
```

## Example 1

```javascript
const result = $try(() => {
  throw SyntaxError;
}).catch(ReferenceError, () => {
  // noop
}).catch([TypeError, SyntaxError], () => {
  // to be called
}).other((error) => {
  // noop
}).finally(({ result, error }) => {
  return result;
});

console.log(result); // { error: SyntaxError, result: undefined }
```

## Example 2

```javascript
const result = $try(() => {
  return [1, 2, 3];
}).catch(ReferenceError, () => {
  // noop
}).catch([TypeError, SyntaxError], () => {
  // to be called
}).other((error) => {
  // noop
}).finally(({ result, error }) => {
  return result;
});

console.log(result); // {error: undefined, result: [1, 2, 3]}
```

## Example 3

```javascript
const result = $try(() => {
  throw SyntaxError;
})

console.log(result); // { error: SyntaxError, result: undefined }
```

## Promises example

```typescript
class AuthError extends Error {}

function proc(event: string) {
  return $try(() => new Promise((resolve, reject) => {
    switch (event) {
      case 'resolve':
        resolve('resolved')
        break;
      case 'reject':
        reject('rejected')
        break;
      case 'syntax':
        throw SyntaxError
      case 'auth':
        throw AuthError
      case 'error':
        throw 'error'
      default:
        throw 'other errors'
    }
  }).catch('error', () => {
    // console.log('error')
  }).catch([SyntaxError, AuthError], (error) => {
    // console.log(error)
  }).other((error) => {
    // console.log(error)
  }).finally(({ value, error }) => {
    // console.log({ value, error })
  })
}

await proc('resolve') // { value: 'resolved' }}
await proc('reject')  // { error: 'rejected' }

await proc('syntax')  // { error: SyntaxError }
await proc('auth')    // { error: AuthError }
await proc('error')   // { error: 'error' }
await proc('other')   // { error: 'other errors' }
```
