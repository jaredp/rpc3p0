import { app } from './api';
import './sample-endpoints';

const port = 9001;
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
