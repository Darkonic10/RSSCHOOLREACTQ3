import React from 'react';
import HeaderComponent from './components/header/header.component.tsx';
import MainComponent from './components/main/main.component.tsx';

class App extends React.Component {
  render() {
    return (
      <>
        <HeaderComponent />
        <MainComponent />
      </>
    );
  }
}

export default App;
