import React from 'react';
import './App.css'
import { Demo1ImportingFunction } from './Demo1ImportingFunction';

import { Demo1ImportingType } from './Demo1ImportingType';
import { Demo2 } from './Demo2';
import { Demo3 } from './Demo3';

const Page: React.FC<{}> = props => {
  return (
    <div className="App">
      <header className="App-header">
        { props.children }
      </header>
    </div>
  )
}

function App() {
  return (<>
    <Page>
        <Demo1ImportingType />
    </Page>

    <Page>
      <Demo1ImportingFunction />
    </Page>

    <Page>
        <Demo2 />
    </Page>

    <Page>
        <Demo3 />
    </Page>
  </>);
}

export default App;
