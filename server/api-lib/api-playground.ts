import { app, RegisteredTypedEndpoints } from "./api";
import _ from 'lodash';
import { createTypeAlias, printNode, zodToTs } from "zod-to-ts";
import { config } from './config';

app.get('/api/playground', (req, res) => {
    if (!config.DEBUG) {
        res.sendStatus(401);
        return;
    }

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

            td {
                vertical-align: top;
                padding-bottom: 30px;
                padding-right: 80px;
            }
        </style>
        </head>
        <body>
            <h1>Server Endpoints</h1>
            <table>
                ${ RegisteredTypedEndpoints.map(endpoint => {
                    const mockedValidator = endpoint.inputValidator({});
                    const inpuTypeName = `${endpoint.name}Params`;
                    const ppTsType = printNode(
                        createTypeAlias(
                            zodToTs(mockedValidator, inpuTypeName).node,
                            inpuTypeName
                        )
                    ).trim();

                    return `
                        <tr>
                            <td style="">
                                <div style="font-size: 18px; font-family: monospace">
                                    ${ endpoint.name }
                                </div>
                                <div style="color: #888; font-family: monospace; font-size: 14px">
                                    ${ _.compact([endpoint.location?.file, endpoint.location?.line]).join(':') }
                                </div>
                            </td>
                            <td>
                                <div style="font-family: monospace; white-space: pre"
                                >${ ppTsType }</div>
                            </td>
                        </tr>
                    `;
                }).join('\n') }
            </table>
        </body>
        </html>
    `);
});
