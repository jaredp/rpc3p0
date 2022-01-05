import React from 'react';
import { capitalize } from '../../server/v1-by-type';

export function Demo1ImportingFunction() {
  const [text, setText] = React.useState('yeet');

  const [serverValue, setServerValue] = React.useState('');
  React.useEffect(() => {
      (async () => {

        const data_from_server = await capitalize({
            str: text
        });

        setServerValue(data_from_server);
      })();
  }, [text]);

  return <div>
    <h1>Demo 1 (importing by function)</h1>
    <input type="text" value={text} onChange={(evt) => setText(evt.target.value)} />
    <p>{serverValue}</p>
  </div>;
}
