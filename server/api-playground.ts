import { app, RegisteredTypedEndpoints } from "./api";
import _ from 'lodash';

app.get('/api/playground', (req, res) => {
    const root_dir = process.cwd();

    res.send(`
        <html>
        <head>
        <style>
            body {
                max-width: 800px;
                padding: 5em 2em;
                margin: auto;

                font-family: sans-serif;
            }

            h1 {
                margin: 1em 0em;
            }
        </style>
        </head>
        <body>
            <h1>Server Endpoints</h1>
            <table>
                ${ RegisteredTypedEndpoints.map(endpoint => {
                    return `
                        <tr>
                            <td style="padding-bottom: 1em">
                                <div style="font-size: 18px; font-family: monospace">
                                    ${ endpoint.name }
                                </div>
                                <div style="color: #888; font-family: monospace; font-size: 14px">
                                    ${ _.compact([endpoint.location?.file, endpoint.location?.line]).join(':') }
                                </div>
                            </td>
                            <td>
                            </td>
                        </tr>
                    `;
                }).join('\n') }
            </table>
        </body>
        </html>
    `);
});
