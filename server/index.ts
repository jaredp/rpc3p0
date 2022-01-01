import express from 'express';
import cors from 'cors';
import { hello, moreComplicated } from './sample-endpoints';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});


function api(route: string, handler: any) {
    app.post(route, async (req, res) => {
        const input = req.body;
        const output = await Promise.resolve(handler(input));
        res.json(output);
    });    
}

api('/api/v1/hello', hello);
api('/api/v1/moreComplicated', moreComplicated);


const port = 9001;
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
