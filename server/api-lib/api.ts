import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { z, ZodObject } from "zod";
import { StackFrame, getStack } from '../StackFrame';
import { config } from './config';

export const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
    credentials: true,
    origin: true
 }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

export function api(route: string, handler: (params: any, req?: express.Request, res?: express.Response) => any) {
    app.post(`/api/v1/${route}`, async (req, res) => {
        const input = req.body;
        try {
            const output = await Promise.resolve(handler(input, req, res));
            if (output === undefined) {
                // if the function rpc returns void, let's send null so the
                // client, which is always going to JSON.parse(res.body),
                // doesn't throw trying to parse the empty string.
                return res.json(null);
            }
            res.json(output);
        } catch (err) {
            console.error("Caught error in", route, err);
            if (config.DEBUG) {
                res.status(500).json({
                    message: err instanceof Error ? err.message : undefined,
                    error: err,
                    stack: err instanceof Error ? err.stack?.split('\n') : null
                });
            } else {
                res.sendStatus(500);
            }
        }
    });    
}


/// Incomplete APIs. Only use these for learning the mechanism, not in prod.

export function autoapi(handler: Function, validator: ZodObject<any>) {
    api(handler.name, async (params: unknown) => {
        return await handler(validator.parse(params));
    });
}

export function untyped_autoapi(handler: (params: any) => any) {
    api(handler.name, handler);
}


export function strictcompactapi<T extends ZodObject<any, "strict", any, any>, R>(
    name: string,
    inputValidator: T,
    impl: (params: z.output<T>) => Promise<R>
): ((params: z.input<T>) => Promise<R>) {
    const typedHandler = async (params: z.input<T>): Promise<R> => {
        return await impl(inputValidator.parse(params));
    };

    // register the endpoint
    api(name, typedHandler);

    return typedHandler;
}

/// Final API

interface RegisteredTypedEndpoint {
    name: string;
    inputValidator: (req: RequestDetails) => any,
    impl: (params: any) => Promise<any>;
    location?: StackFrame;
}
export const RegisteredTypedEndpoints: RegisteredTypedEndpoint[] = [];

export interface RequestDetails {
    req?: express.Request,
    res?: express.Response,
}

export function compactapi<T extends ZodObject<any, "strict", any, any>, R>(
    name: string,
    inputValidator: (req: RequestDetails) => T,
    impl: (params: z.output<T>) => Promise<R>
): ((params: z.input<T>) => Promise<R>) {
    const typedHandler = async (params: z.input<T>, req?: express.Request, res?: express.Response): Promise<R> => {
        const parsedParams = await inputValidator({req, res}).parseAsync(params); 
        return await impl(parsedParams);
    };

    // register the endpoint
    api(name, typedHandler);

    // save the endpoint for metaprogramming
    RegisteredTypedEndpoints.push({
        name, inputValidator, impl,
        location: getStack()[1] ?? undefined
    });

    return typedHandler;
}

export function ZodInject<T>(factory: () => T) {
    return z.undefined().optional().transform(factory);
}



