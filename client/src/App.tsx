import React from 'react';
import logo from './logo.svg';
import './App.css'
import { capitalize, hello, moreComplicated, SayHello } from '../../server/sample-endpoints';

function App() {
    React.useEffect(() => {
        (async () => {
            console.log("wait really", await hello());
            console.log("wait really", await capitalize({str: 'yeet'}));
            console.log("subject:", await SayHello({firstName: "Jared", lastName: "Pochtar"}));

            const result = await moreComplicated({n: 5});
            console.log(result);
            // type error if you uncomment the next line:
            // console.log(result.fux);
            console.log(result.add);
            return result;
        })();
    }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
