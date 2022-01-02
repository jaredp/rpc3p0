import express from 'express';
import cors from 'cors';
import { ZodObject } from 'zod';

export const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const DEBUG = true;

export function api(route: string, handler: any) {
    app.post(`/api/v1/${route}`, async (req, res) => {
        const input = req.body;
        try {
            const output = await Promise.resolve(handler(input));
            res.json(output);
        } catch (err) {
            console.error(err);
            if (DEBUG) {
                res.status(500).json({
                    error: err,
                    stack: err instanceof Error ? err.stack?.split('\n') : null
                });
            } else {
                res.sendStatus(500);
            }
        }
    });    
}

// TODO typing the validator and handler
export function autoapi(handler: Function, validator: ZodObject<any>) {
    api(handler.name, async (params: unknown) => {
        return await handler(validator.parse(params));
    });
}

export function untyped_autoapi(handler: Function) {
    api(handler.name, handler);
}
