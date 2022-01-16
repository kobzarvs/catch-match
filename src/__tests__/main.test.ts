import $try, { PromisedTryReturn } from '../main';

describe('sync version', () => {
  test('should be return result from `finally` branch', () => {
    let matchReferenceError = jest.fn();
    let matchArrayOfErrors = jest.fn();
    let matchOther = jest.fn();
    let matchFinally = jest.fn();

    const result = $try(() => {
      return [1, 2, 3];
    }).catch(ReferenceError, () => {
      matchReferenceError();
    }).catch([TypeError, SyntaxError], (error) => {
      matchArrayOfErrors(error);
    }).other((error) => {
      matchOther(error);
    }).finally(({ value, error }) => { //?
      matchFinally({ value, error });
    });

    expect(matchReferenceError).not.toBeCalled();
    expect(matchArrayOfErrors).not.toBeCalled();
    expect(matchOther).not.toBeCalled();
    expect(matchFinally).toBeCalled();
    expect(result).toMatchObject({ error: undefined, value: [1, 2, 3] });
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
    }).catch([TypeError, SyntaxError], (error) => {
      matchArrayOfErrors(error);
    }).other((error) => {
      matchOther(error);
    }).finally(({ value, error }) => {
      matchFinally({ value, error });
      return value; // ?
    });

    expect(matchReferenceError).toBeCalled();
    expect(matchArrayOfErrors).not.toBeCalled();
    expect(matchOther).not.toBeCalled();
    expect(matchFinally).toBeCalled();
    expect(result).toMatchObject({ error: ReferenceError, value: undefined });
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
    }).catch([TypeError, SyntaxError], (error) => {
      matchArrayOfErrors(error);
    }).other((error) => {
      matchOther(error);
    }).finally(({ value, error }) => {
      matchFinally({ value, error });
      return value; // ?
    });

    expect(matchReferenceError).not.toBeCalled();
    expect(matchArrayOfErrors).toBeCalledWith(SyntaxError);
    expect(matchOther).not.toBeCalled();
    expect(matchFinally).toBeCalled();
    expect(result).toMatchObject({ error: SyntaxError, value: undefined });
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
    }).catch([TypeError, SyntaxError], (error) => {
      matchArrayOfErrors(error);
    }).other((error) => {
      matchOther(error);
    }).finally(({ value, error }) => {
      matchFinally({ value, error });
      return value; // ?
    });

    expect(matchReferenceError).not.toBeCalled();
    expect(matchArrayOfErrors).not.toBeCalled();
    expect(matchOther).toBeCalled();
    expect(matchFinally).toBeCalled();
    expect(result).toMatchObject({ error: 'error', value: undefined });
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
    }).catch([TypeError, SyntaxError], (error) => {
      matchArrayOfErrors(error);
    }).other((error) => {
      matchOther(error);
    }).finally(({ value, error }) => {
      matchFinally({ value, error });
    });

    expect(matchCustomError).toBeCalled();
    expect(matchArrayOfErrors).not.toBeCalled();
    expect(matchOther).not.toBeCalled();
    expect(matchFinally).toBeCalled();
    expect(result).toMatchObject({ error: CustomError, value: undefined });
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
    }).catch([TypeError, SyntaxError], (error) => {
      matchArrayOfErrors(error);
    }).finally(({ value, error }) => {
      matchFinally({ value, error });
      return value; // ?
    });

    expect(matchCustomError).not.toBeCalled();
    expect(matchArrayOfErrors).not.toBeCalled();
    expect(matchOther).not.toBeCalled();
    expect(matchFinally).toBeCalled();
    expect(result).toMatchObject({ error: CustomError, value: undefined });
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
    }).catch([TypeError, SyntaxError], (error) => {
      matchArrayOfErrors(error);
    });

    expect(matchCustomError).not.toBeCalled();
    expect(matchArrayOfErrors).not.toBeCalled();
    expect(matchOther).not.toBeCalled();
    expect(matchFinally).not.toBeCalled();
    expect(result).toMatchObject({ error: CustomError, value: undefined });
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
    expect(result).toMatchObject({ error: CustomError, value: undefined });
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
    expect(result).toMatchObject({ error: SyntaxError, value: undefined });
  });
});

/**
 * async tests
 */
describe('promised version', () => {
  test('resolve try', async () => {
    let matchCustomError = jest.fn();
    let matchArrayOfErrors = jest.fn();
    let matchOther = jest.fn();
    let matchFinally = jest.fn();

    const result = $try(() => {
      return Promise.resolve(42);
    });

    await result;

    expect(matchCustomError).not.toBeCalled();
    expect(matchArrayOfErrors).not.toBeCalled();
    expect(matchOther).not.toBeCalled();
    expect(matchFinally).not.toBeCalled();

    expect(result).toBeInstanceOf(Promise);
    expect(await result).toEqual({
      value: 42,
      error: undefined,
    });
  });
  test('reject try', async () => {
    let matchCustomError = jest.fn();
    let matchArrayOfErrors = jest.fn();
    let matchOther = jest.fn();
    let matchFinally = jest.fn();

    const result = $try(() => {
      return Promise.reject(42);
    });

    expect(matchCustomError).not.toBeCalled();
    expect(matchArrayOfErrors).not.toBeCalled();
    expect(matchOther).not.toBeCalled();
    expect(matchFinally).not.toBeCalled();

    expect(result).toBeInstanceOf(Promise);
    expect(await result).toEqual({
      value: undefined,
      error: 42,
    });
  });
  test('throw try', async () => {
    const result = $try(() => {
      return new Promise(() => {
        throw new Error('error');
      });
    });

    expect(result).toBeInstanceOf(Promise);

    expect(await result).toEqual({
      value: undefined,
      error: Error('error'),
    });
  });

  test('resolve try.catch', async () => {
    let matchError = jest.fn();
    let matchSyntaxError = jest.fn();
    let matchOther = jest.fn();

    const result = $try(() => {
      return Promise.resolve(42);
    }).catch(Error, () => {
      matchError();
    }).catch(SyntaxError, () => {
      matchSyntaxError();
    }).other((error) => {
      matchOther(error);
    });

    expect(matchError).not.toBeCalled();
    expect(matchSyntaxError).not.toBeCalled();
    expect(matchOther).not.toBeCalled();

    expect(result).toBeInstanceOf(Promise);
    expect(await result).toEqual({
      value: 42,
      error: undefined,
    });
  });
  test('reject try.catch', async () => {
    let matchError = jest.fn();
    let matchOther = jest.fn();

    const result = $try(() => {
      return Promise.reject(123);
    }).catch(Error, () => {
      matchOther();
    }).catch(123, () => {
      matchError();
    }).catch('error', () => {
      matchOther();
    });

    await result; //?

    expect(matchOther).not.toBeCalled();
    expect(matchError).toBeCalled();

    expect(result).toBeInstanceOf(Promise);
    expect(await result).toEqual({
      value: undefined,
      error: 123,
    });
  });
  test('throw try.catch', async () => {
    let matchError = jest.fn();
    let matchOther = jest.fn();

    const result = $try(() => {
      return new Promise(() => {
        throw 'error';
      });
    }).catch(Error, () => {
      matchOther();
    }).catch(123, () => {
      matchError();
    }).catch('error', () => {
      matchOther();
    });

    expect(result).toBeInstanceOf(Promise);
    expect(await result).toEqual({
      value: undefined,
      error: 'error',
    });

    expect(matchOther).toBeCalledTimes(1);
    expect(matchError).not.toBeCalled();
  });

  test('resolve try.other', async () => {
    let matchCustomError = jest.fn();
    let matchArrayOfErrors = jest.fn();
    let matchOther = jest.fn();
    let matchFinally = jest.fn();

    const result = $try(() => {
      return Promise.resolve('ok');
    }).other(({ value, error }) => {
      matchOther({ value, error });
    });

    expect(result).toBeInstanceOf(Promise);
    expect(await result).toEqual({
      value: 'ok',
      error: undefined,
    });

    expect(matchCustomError).not.toBeCalled();
    expect(matchArrayOfErrors).not.toBeCalled();
    expect(matchOther).not.toBeCalled();
    expect(matchFinally).not.toBeCalled();
  });
  test('reject try.other', async () => {
    let matchError = jest.fn();
    let matchOther = jest.fn();

    const result = $try(() => {
      return Promise.reject('error');
    }).catch('error1', () => {
      matchError();
    }).catch('error2', () => {
      matchError();
    }).other((error) => {
      matchOther(error);
    });

    expect(result).toBeInstanceOf(Promise);
    expect(await result).toEqual({
      value: undefined,
      error: 'error',
    });

    expect(matchError).not.toBeCalled();
    expect(matchOther).toBeCalledWith('error');
  });
  test('throw try.other', async () => {
    let matchError = jest.fn();
    let matchOther = jest.fn();

    const result = $try(() => {
      return new Promise(() => {
        throw 'error';
      });
    }).catch('error1', () => {
      matchError();
    }).catch('error2', () => {
      matchError();
    }).other((error) => {
      matchOther(error);
    });

    expect(result).toBeInstanceOf(Promise);
    expect(await result).toEqual({
      value: undefined,
      error: 'error',
    });

    expect(matchError).not.toBeCalled();
    expect(matchOther).toBeCalledWith('error');
  });

  test('when throw should be match array or exception', async () => {
    let matchSingleError = jest.fn();
    let matchArrayError = jest.fn();
    let matchOther = jest.fn();
    let matchFinally = jest.fn();

    const attach = (ctx: PromisedTryReturn<any>) => {
      return ctx.catch(SyntaxError, () => {
        matchSingleError(SyntaxError);
      }).catch([ReferenceError, SyntaxError], (error) => {
        matchArrayError(error);
      }).other((error) => {
        matchOther(error);
      }).finally(({ value, error }) => {
        matchFinally({ value, error });
      });
    };

    const testSingle = $try(() => new Promise(() => {
      throw SyntaxError;
    }));

    const testArray = $try(() => new Promise(() => {
      throw ReferenceError;
    }));

    const testOther = $try(() => new Promise(() => {
      throw TypeError;
    }));

    const testResolve = $try(() => new Promise((resolve) => {
      resolve('ok');
    }));

    const testReject = $try(() => new Promise((_, reject) => {
      reject('reject');
    }));

    const resultSingle = attach(testSingle);
    const resultArray = attach(testArray);
    const resultOther = attach(testOther);
    const resultResolve = attach(testResolve);
    const resultReject = attach(testReject);

    expect(resultSingle).toBeInstanceOf(Promise);
    expect(resultArray).toBeInstanceOf(Promise);
    expect(resultOther).toBeInstanceOf(Promise);
    expect(resultResolve).toBeInstanceOf(Promise);
    expect(resultReject).toBeInstanceOf(Promise);

    expect(await resultSingle).toEqual({
      value: undefined,
      error: SyntaxError,
    });
    expect(await resultArray).toEqual({
      value: undefined,
      error: ReferenceError,
    });
    expect(await resultOther).toEqual({
      value: undefined,
      error: TypeError,
    });
    expect(await resultResolve).toEqual({
      value: 'ok',
    });
    expect(await resultReject).toEqual({
      error: 'reject',
    });
  });
});
