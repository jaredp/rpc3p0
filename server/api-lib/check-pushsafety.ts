/* 
Usage:

build prod-types with:
  (cd server && tsc --declaration --emitDeclarationOnly --outDir pushsafety-tmp/types)
Will have to do that at build time, tar gz it, upload
Then at check time, curl | tar gz it into a known dir

ts-node -T -e "import * as ps from './api-lib/check-pushsafety.ts'; ps.run_check()"
ts-node -T -e "import * as ps from './api-lib/check-pushsafety.ts'; ps.list_endpoints()"

*/

// @ts-ignore
import { execa_promise } from './fuck-tsnode-esmodules-execa';
import path from 'path';
import _ from 'lodash';
import { promises as fs } from 'fs';

import '../import-all-endpoints';
import { RegisteredTypedEndpoints } from './api';


function esimport_for_file_path(file: string) {
    const { dir, name } = path.parse(file);
    return dir ? `${dir}/${name}` : name;

}

function stub_code_for_endpoint(endpoint: string, new_location: string, old_location: string) {
    return `
import { ${endpoint} as NEW_${endpoint} } from '../../${esimport_for_file_path(new_location)}';
import { ${endpoint} as OLD_${endpoint} } from '../prod-types/${esimport_for_file_path(old_location)}';


function check_${endpoint}(newer_object: typeof OLD_${endpoint}): typeof NEW_${endpoint} {
    return newer_object;
}
    `.trim();
}

async function make_stubs() {
    const new_endpoints = get_endpoints();
    const old_endpoints = JSON.parse(await fs.readFile('pushsafety-tmp/prod-types/endpoints.json', 'utf-8'));

    for (const { name, file: old_location } of old_endpoints) {
        const new_endpoint = new_endpoints.find(e => e.name === name);
        if (!new_endpoint) {
            console.log(`${name} was removed`);
            console.log(); // newline
            continue;
        }
        const new_location = new_endpoint.file!;

        const stub_code = stub_code_for_endpoint(name, new_location, old_location);

        await fs.writeFile(`pushsafety-tmp/stubs/check-${name}.ts`, stub_code);
    }

}

export async function run_check() {
    const { execa } = await execa_promise;

    execa('mkdir', ['-p', 'pushsafety-tmp']);
    execa('rm', ['-rf', 'pushsafety-tmp/stubs']);
    execa('mkdir', ['pushsafety-tmp/stubs']);

    await make_stubs();

    const { stdout, exitCode } = await execa('tsc', ['--noEmit'], {all: true, reject: false});
    if (exitCode == 0) {
        return;
    }

    // I can't figure out how to get ts-node to stop complaining about ESM bullshit 
    const unrecognized_errors: string[] = []; // 
    const recognized_errors: { endpoint: string, position: 'unk' | 'request' | 'response', lines: string }[] = [] // 

    let current_state: null | { endpoint: string, position?: 'unk' | 'request' | 'response', lines: string[] } = null; // 
    function reset_current_error() {
        if (!current_state) {
            return;
        }

        if (!current_state.position) {
            // something broke
            current_state = null;
            return;
        }

        const error_msg = current_state.lines.join('\n');
        
        // The problem is (T) => Promise<$R> is not a subtype of (T) => Promise<void>
        // note errors about 'params' will take precedence over return types, which is good,
        // because we wouldn't want to ignore param mismatches just because we had a false alarm over
        // not returning void anymore
        const is_changing_empty_response = current_state.position === 'response' && error_msg.trim().startsWith("Type 'void' is not assignable to type 'string'");

        const skip = is_changing_empty_response; // || add more cases later

        if (!skip) {
            recognized_errors.push({
                endpoint: current_state.endpoint,
                position: current_state.position,
                lines: error_msg
            });    
        }
        
        current_state = null;
    }

    for (const line of stdout.split('\n')) {
        // 1st line of relevant error
        const new_erorr_line_match = line.match(/^pushsafety-tmp\/stubs\/check-([^\)]+).ts\([^\)]+\): error TS2322/);
        if (new_erorr_line_match) {
            reset_current_error();
            current_state = { endpoint: new_erorr_line_match[1], lines: [] };
            continue;
        }

        // 1st line of irrelivant error
        if (!line.startsWith('  ')) {
            // some other kind of error
            reset_current_error();
            unrecognized_errors.push(line);
            continue;
        }

        if (!current_state) {
            continue;
        }

        // 2nd line of relevant error
        if (!current_state.position) {
            if (line === "  Types of parameters 'params' and 'params' are incompatible.") {
                current_state.position = 'request';
            } else if (line.match(/^  Type 'Promise<.+>' is not assignable to type 'Promise<.+>'\.$/)) {
                current_state.position = 'response';   
            } else {
                current_state.position = 'unk';
            }
            continue;
        }

        current_state.lines.push(line);
        // current_state.lines.push(line.slice(2));
    }

    reset_current_error();

    // console.log(JSON.stringify({recognized_errors, unrecognized_errors}, null, '  '));

    for (const fail of recognized_errors) {
        console.log(`${fail.endpoint} breaks ${fail.position} types:`);
        console.log(fail.lines);
        console.log(); // newline
    }
}

function get_endpoints() {
    return RegisteredTypedEndpoints.map(re => ({
        name: re.name,
        file: re.location?.file
    }));
}

export function list_endpoints() {
    console.log(JSON.stringify(get_endpoints(), null, '  '));
}

