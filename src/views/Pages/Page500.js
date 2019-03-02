import React, { Component } from 'react';
import logo from '../../logo/vmk_v3_1.png';
import '../../App.css';

class Page500 extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} style={{color: "#fff"}} className="App-logo" alt="logo" />
          <p>
            Error 500 Right HERE
          </p>
        </header>
      </div>
    );
  }
}

export default Page500;