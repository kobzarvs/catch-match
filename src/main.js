export function _try(body) {
    let error;
    let result;
    let context = {};
    const isSameInstance = (e1) => e1 === error || e1 === (error === null || error === void 0 ? void 0 : error.constructor);
    try {
        result = body(context);
    }
    catch (e) {
        error = e;
    }
    const chain = {
        catch: (err, handler) => {
            if (!err || !handler) {
                return chain;
            }
            if (isSameInstance(err)) {
                handler && handler(context);
            }
            else if (Array.isArray(err)) {
                err.some(isSameInstance) && handler(context);
            }
            return chain;
        },
        other: (handler) => {
            if (error) {
                handler && handler(error, context);
            }
            return {
                finally: chain.finally
            };
        },
        finally: (callback) => {
            return {
                value: callback ? callback({ value: result, error, context }) : result,
                error,
                context,
            };
        },
    };
    return chain;
}
//# sourceMappingURL=main.js.map