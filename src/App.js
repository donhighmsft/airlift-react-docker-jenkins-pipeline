import React, { Component } from 'react';
import logo from './logo.svg';
import containerImg from './container_img.png'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Airlift React Docker and Jenkins Sample</h1>
        </header>
        
        <h1 className="Main-title">All About Containers and DevOps</h1>
        <p></p>
        <img src={containerImg}   alt="container_logo" />
      </div>
    );
  }
}

export default App;
