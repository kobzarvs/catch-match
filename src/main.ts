export type ResultType<Rsult, ErrorType> = {
  result?: Rsult;
  error?: ErrorType;
};

export type ErrrorHandler<ErrorType> = (error?: ErrorType) => void;

export type FinallyCallback<Result, ErrorType> = ((params: ResultType<Result, ErrorType>) => Result | void | undefined);

export type TryReturn<Result, ErrorType = any> = {
  catch: (error: ErrorType | ErrorType[], handler: ErrrorHandler<ErrorType>) => TryReturn<Result, ErrorType>;
  other: (handler: ErrrorHandler<ErrorType>) => Pick<TryReturn<Result, ErrorType>, 'finally'>,
  finally: (callback?: FinallyCallback<Result, ErrorType>) => ResultType<Result, ErrorType>,
  result: Result,
  error: ErrorType
}

export type TryBody<Result> = () => Result | never;

export function $try<Return>(body: TryBody<Return>): TryReturn<Return> {
  let caught = false;
  let error: any | { constructor?: any; };
  let result: Return | any;
  const isSameInstance = (e1: any) => e1 === error || e1 === error?.constructor;

  try {
    result = body();
  } catch (e) {
    error = e;
  }

  const chain: TryReturn<typeof result, typeof error> = {
    catch: (err, handler) => {
      if (!err || !handler) {
        return chain;
      }
      if (isSameInstance(err)) {
        handler && handler();
        caught = true;
      } else if (Array.isArray(err) && err.some(isSameInstance)) {
        handler && handler();
        caught = true;
      }
      return chain;
    },

    other: (handler) => {
      if (!caught && error) {
        handler && handler(error);
      }
      return {
        finally: chain.finally,
        result,
        error,
      };
    },

    finally: (callback?) => {
      return {
        result: callback ? callback({ result, error }) : result,
        error,
      };
    },
    result,
    error,
  };

  return chain;
}

export default $try;
