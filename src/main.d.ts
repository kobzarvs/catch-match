declare type InternalData<T> = {
    value?: T;
    error?: any;
    context?: any;
};
export declare function _try<T>(body: (context: any) => T): {
    catch: (err: any, handler: (context: any) => void) => any;
    other: (handler: (error: any, context: any) => void) => {
        finally: (callback: (params: InternalData<T>) => T) => InternalData<T>;
    };
    finally: (callback: (params: InternalData<T>) => T) => InternalData<T>;
};
export {};
