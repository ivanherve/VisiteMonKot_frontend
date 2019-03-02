import React, { Component } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Route } from 'react-router-dom';
import '../App.css';
import logo from '../logo/vmk_v5_1.svg';
import Footer from './Footer';
import Headers from './Header';


class Layout extends Component {
  render() {
    return (
      <div>
        <Headers />
        <div style={{ marginTop: '70px' }}>
          
        </div>
        <Footer />
      </div>
    );
  }
}

export default Layout;
