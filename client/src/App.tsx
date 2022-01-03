import React from 'react';
import logo from './logo.svg';
import './App.css'
import { capitalize, hello, moreComplicated, SayHello } from '../../server/sample-endpoints';
import { AddressRecipient } from '../../server/AddressRecipient';
import { useQuery } from './query-utils';

function Demo1() {
  const {isLoading, data: recipient} = useQuery(AddressRecipient, {
    firstName: "Jared",
    lastName: "Pochtar"
  });

  if (isLoading) {
    return <>"Loading..."</>;
  }

  return <div>
    <h1>Demo 1</h1>
    <p>{recipient?.firstLine}</p>
    <p>{recipient?.body}</p>
  </div>
}

function Demo2() {
  const [text, setText] = React.useState('yeet');
  const {data} = useQuery(capitalize, {
    str: text
  });

  return <div>
    <h1>Demo 2</h1>
    <input type="text" value={text} onChange={(evt) => setText(evt.target.value)} />
    <p>{data}</p>
  </div>
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Demo1 />
        <Demo2 />
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
