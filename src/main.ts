type InternalData<T> = {
  value?: T;
  error?: any;
  context?: any;
};

export function _try<T>(body: (context: any) => T) {
  let error: any;
  let result: T;
  let context: any = {};
  const isSameInstance = (e1: any) => e1 === error || e1 === error?.constructor;

  try {
    result = body(context);
  } catch (e) {
    error = e;
  }

  const chain = {
    catch: (err: any, handler: (context: any) => void) => {
      if (!err || !handler) {
        return chain;
      }
      if (isSameInstance(err)) {
        handler && handler(context);
      } else if (Array.isArray(err)) {
        err.some(isSameInstance) && handler(context);
      }
      return chain;
    },
    other: (handler: (error: any, context: any) => void) => {
      if (error) {
        handler && handler(error, context);
      }
      return {
        finally: chain.finally
      };
    },
    finally: (callback: (params: InternalData<T>) => T): InternalData<T> => {
      return {
        value: callback ? callback({value: result, error, context}) : result,
        error,
        context,
      };
    },
  };

  return chain;
}

export default _try;
