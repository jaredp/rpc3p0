import { app } from './api-lib/api';
import { config } from './api-lib/config';
import './api-lib/api-playground';
import './import-all-endpoints';

config.DEBUG = true;
const port = 9001;

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
