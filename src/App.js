import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import { Switch, Route } from 'react-router-dom'
import UserInfo from "./Components/UserInfo/UserInfo";

const Main = () => (
  <main>
    <Switch>
      <Route path = '/' render = {() => {
        return <UserInfo/>
      }}/>
    </Switch>
  </main>
)

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">
            Welcome to chat App
          </h1>
        </header>
        <Main/>
      </div>
    );
  }
}

export default App;