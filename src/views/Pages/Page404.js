import React, { Component } from 'react';
import logo from '../../logo/vmk_v3_1.png';
import '../../App.css';

class Page404 extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} style={{color: "#fff"}} className="App-logo" alt="logo" />
          <p>
            Error 404 Right Here
          </p>
        </header>
      </div>
    );
  }
}

export default Page404;