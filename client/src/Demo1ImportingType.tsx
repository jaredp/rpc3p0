import React from 'react';
import type { capitalize } from '../../server/v1-by-type';

async function _rpc(route: string, args: any) {
    const result = await fetch(`http://localhost:9001/api/v1/${route}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(args)  
    });
    if (result.status === 200) {
        return await result.json();
    }

    let error_detail = null;
    try {
        error_detail = await result.json();
    } catch (error) {}

    console.error(`[RPC ${route}]`, result, error_detail);
    throw new Error(`[RPC ${route}] ${error_detail?.message || ""}`);
}
function rpc<T>(route: string): T {
    return ((params: any) => { return _rpc(route, params); }) as unknown as T;
}


export function Demo1ImportingType() {
  const [text, setText] = React.useState('yeet');

  const [serverValue, setServerValue] = React.useState('');
  React.useEffect(() => {
      (async () => {

        const data_from_server = await rpc<typeof capitalize>('capitalize')({
            str: text
        });

        setServerValue(data_from_server);
      })();
  }, [text]);

  return <div>
    <h1>Demo 1</h1>
    <input type="text" value={text} onChange={(evt) => setText(evt.target.value)} />
    <p>{serverValue}</p>
  </div>;
}
