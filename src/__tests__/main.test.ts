import $try from '../main';

test('should be return result from `finally` branch', () => {
  let matchReferenceError = jest.fn();
  let matchArrayOfErrors = jest.fn();
  let matchOther = jest.fn();
  let matchFinally = jest.fn();

  const result = $try(() => {
    return [1, 2, 3];
  }).catch(ReferenceError, () => {
    matchReferenceError();
  }).catch([TypeError, SyntaxError], () => {
    matchArrayOfErrors();
  }).other((error) => {
    matchOther(error);
  }).finally(({ result, error }) => {
    matchFinally({ result, error });
    return result;
  });

  expect(matchReferenceError).not.toBeCalled();
  expect(matchArrayOfErrors).not.toBeCalled();
  expect(matchOther).not.toBeCalled();
  expect(matchFinally).toBeCalled();
  expect(result).toEqual({ error: undefined, result: [1, 2, 3] });
});

test('should be match single exception', () => {
  let matchReferenceError = jest.fn();
  let matchArrayOfErrors = jest.fn();
  let matchOther = jest.fn();
  let matchFinally = jest.fn();

  const result = $try(() => {
    throw ReferenceError;
  }).catch(ReferenceError, () => {
    matchReferenceError();
  }).catch([TypeError, SyntaxError], () => {
    matchArrayOfErrors();
  }).other((error) => {
    matchOther(error);
  }).finally(({ result, error }) => {
    matchFinally({ result, error });
    return result;
  });

  expect(matchReferenceError).toBeCalled();
  expect(matchArrayOfErrors).not.toBeCalled();
  expect(matchOther).not.toBeCalled();
  expect(matchFinally).toBeCalled();
  expect(result).toEqual({ error: ReferenceError, result: undefined });
});

test('should be match array of exceptions', () => {
  let matchReferenceError = jest.fn();
  let matchArrayOfErrors = jest.fn();
  let matchOther = jest.fn();
  let matchFinally = jest.fn();

  const result = $try(() => {
    throw SyntaxError;
  }).catch(ReferenceError, () => {
    matchReferenceError();
  }).catch([TypeError, SyntaxError], () => {
    matchArrayOfErrors();
  }).other((error) => {
    matchOther(error);
  }).finally(({ result, error }) => {
    matchFinally({ result, error });
    return result;
  });

  expect(matchReferenceError).not.toBeCalled();
  expect(matchArrayOfErrors).toBeCalled();
  expect(matchOther).not.toBeCalled();
  expect(matchFinally).toBeCalled();
  expect(result).toEqual({ error: SyntaxError, result: undefined });
});

test('should be match any type of exception', () => {
  let matchReferenceError = jest.fn();
  let matchArrayOfErrors = jest.fn();
  let matchOther = jest.fn();
  let matchFinally = jest.fn();

  const result = $try(() => {
    throw 'error';
  }).catch(ReferenceError, () => {
    matchReferenceError();
  }).catch([TypeError, SyntaxError], () => {
    matchArrayOfErrors();
  }).other((error) => {
    matchOther(error);
  }).finally(({ result, error }) => {
    matchFinally({ result, error });
    return result;
  });

  expect(matchReferenceError).not.toBeCalled();
  expect(matchArrayOfErrors).not.toBeCalled();
  expect(matchOther).toBeCalled();
  expect(matchFinally).toBeCalled();
  expect(result).toEqual({ error: 'error', result: undefined });
});

test('should be match custom exceptions', () => {
  let matchCustomError = jest.fn();
  let matchArrayOfErrors = jest.fn();
  let matchOther = jest.fn();
  let matchFinally = jest.fn();

  class CustomError extends Error {
  }

  const result = $try(() => {
    throw CustomError;
  }).catch(CustomError, () => {
    matchCustomError();
  }).catch([TypeError, SyntaxError], () => {
    matchArrayOfErrors();
  }).other((error) => {
    matchOther(error);
  }).finally(({ result, error }) => {
    matchFinally({ result, error });
    return result;
  });

  expect(matchCustomError).toBeCalled();
  expect(matchArrayOfErrors).not.toBeCalled();
  expect(matchOther).not.toBeCalled();
  expect(matchFinally).toBeCalled();
  expect(result).toEqual({ error: CustomError, result: undefined });
});

test('should be return result from `finally` branch without `other`', () => {
  let matchCustomError = jest.fn();
  let matchArrayOfErrors = jest.fn();
  let matchOther = jest.fn();
  let matchFinally = jest.fn();

  class CustomError extends Error {
  }

  const result = $try(() => {
    throw CustomError;
  }).catch([TypeError, SyntaxError], () => {
    matchArrayOfErrors();
  }).finally(({ result, error }) => {
    matchFinally({ result, error });
    return result;
  });

  expect(matchCustomError).not.toBeCalled();
  expect(matchArrayOfErrors).not.toBeCalled();
  expect(matchOther).not.toBeCalled();
  expect(matchFinally).toBeCalled();
  expect(result).toEqual({ error: CustomError, result: undefined });
});


test('should be return result from `catch` branch', () => {
  let matchCustomError = jest.fn();
  let matchArrayOfErrors = jest.fn();
  let matchOther = jest.fn();
  let matchFinally = jest.fn();

  class CustomError extends Error {
  }

  const result = $try(() => {
    throw CustomError;
  }).catch([TypeError, SyntaxError], () => {
    matchArrayOfErrors();
  });

  expect(matchCustomError).not.toBeCalled();
  expect(matchArrayOfErrors).not.toBeCalled();
  expect(matchOther).not.toBeCalled();
  expect(matchFinally).not.toBeCalled();
  expect(result).toMatchObject({ error: CustomError, result: undefined });
});


test('should be return result from `other` branch', () => {
  let matchCustomError = jest.fn();
  let matchArrayOfErrors = jest.fn();
  let matchOther = jest.fn();
  let matchFinally = jest.fn();

  class CustomError extends Error {
  }

  const result = $try(() => {
    throw CustomError;
  }).other((error) => {
    matchOther(error);
  });

  expect(matchCustomError).not.toBeCalled();
  expect(matchArrayOfErrors).not.toBeCalled();
  expect(matchOther).toBeCalledWith(CustomError);
  expect(matchFinally).not.toBeCalled();
  expect(result).toMatchObject({ error: CustomError, result: undefined });
});


test('should be return result without branches', () => {
  let matchCustomError = jest.fn();
  let matchArrayOfErrors = jest.fn();
  let matchOther = jest.fn();
  let matchFinally = jest.fn();

  const result = $try(() => {
    throw SyntaxError;
  });

  expect(matchCustomError).not.toBeCalled();
  expect(matchArrayOfErrors).not.toBeCalled();
  expect(matchOther).not.toBeCalled();
  expect(matchFinally).not.toBeCalled();
  expect(result).toMatchObject({ error: SyntaxError, result: undefined });
});
