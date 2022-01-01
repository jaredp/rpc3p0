import express from 'express';
import cors from 'cors';

export const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

export function api(route: string, handler: any) {
    app.post(route, async (req, res) => {
        const input = req.body;
        const output = await Promise.resolve(handler(input));
        res.json(output);
    });    
}

export function autoapi(handler: Function) {
    api(`/api/v1/${handler.name}`, handler);
}
