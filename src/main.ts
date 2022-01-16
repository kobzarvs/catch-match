export type ErrrorHandler<ErrorType> = (error?: ErrorType) => void

export type FinallyCallback<Result, ErrorType = any> = (params: ResultType<Result, ErrorType>) => void

export type TryBody<Result> = () => Result | Promise<Result> | never

export type ResultType<Result, ErrorType = any> = {
  value?: Result;
  error?: ErrorType;
}

export type FinallyReturn<Return, ErrorType = any> =
  ResultType<Return, ErrorType>

export type OtherReturn<Return, ErrorType = any> =
  FinallyReturn<Return, ErrorType> &
  {
    finally: (callback: FinallyCallback<Return, ErrorType>) => ResultType<Return, ErrorType>
  }

export type CatchReturn<Return, ErrorType = any> =
  FinallyReturn<Return, ErrorType> &
  OtherReturn<Return, ErrorType> &
  {
    catch: (error: ErrorType | ErrorType[], handler: ErrrorHandler<ErrorType>) => PromisedTryReturn<Return>;
    other: (handler: ErrrorHandler<ErrorType>) => Pick<PromisedTryReturn<Return>, 'finally' | 'value' | 'error'>,
  }

export type PromisedTryReturn<Return> =
  CatchReturn<Return> |
  (Promise<ResultType<Return>> & CatchReturn<Return>)

export function $try<Return>(body: TryBody<Return>): PromisedTryReturn<Return> {
  let caught = false;
  let error: any | { constructor?: any; } | Promise<any | { constructor?: any; }>;
  let bodyResponse: Return | Promise<Return>;
  let result: PromisedTryReturn<Return>;

  const isSameError = (e1: any, error: any) => e1 === error || e1 === error?.constructor;

  function handleErrors(err: any[], err2: any, handler: { (error?: any): void; (error?: any): void; (): any }) {
    if (isSameError(err, err2) || (Array.isArray(err) && err.some(e => isSameError(e, err2)))) {
      handler(err2);
      caught = true;
    }
  }

  function buildResult(br: typeof bodyResponse): ResultType<Return> | Promise<ResultType<Return>> {
    if (br instanceof Promise) {
      const bodyPromise = br as Promise<Return>;
      return new Promise<ResultType<Return>>(async (resolve) => {
        bodyPromise.then((response: any) => {
          resolve({
            value: response,
            error: undefined,
          });
        }).catch((e: any) => {
          resolve({
            value: undefined,
            error: e,
          });
        });
      });
    } else {
      return {
        value: br,
        error: undefined,
      };
    }
  }

  const chain: CatchReturn<Return, typeof error> = {
    catch: (err, handler) => {
      if (result instanceof Promise) {
        result.then((response) => {
          typeof response.error !== 'undefined' && !caught && handleErrors(err, response.error, handler);
        });
      } else {
        error && !caught && handleErrors(err, error, handler);
      }
      return result;
    },

    other: (callback) => {
      if (result instanceof Promise) {
        result.then((response) => {
          typeof response.error !== 'undefined' && !caught && callback(response.error);
        });
      } else {
        typeof result.error !== 'undefined' && !caught && callback && callback(result.error);
      }
      return result;
    },

    finally: (callback) => {
      if (result instanceof Promise) {
        result.then((response) => {
          callback(response);
        });
      } else {
        callback({
          value: result.value,
          error: result.error,
        });
      }
      return result;
    },
  };

  try {
    bodyResponse = body();
    result = Object.assign(buildResult(bodyResponse), chain);
  } catch (e) {
    error = e;
    result = Object.assign(chain, {
      value: undefined,
      error: e,
    });
  }

  return result;
}

export default $try;
