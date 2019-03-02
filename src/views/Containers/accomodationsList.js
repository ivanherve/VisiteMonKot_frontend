import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';
import '../../App.css';
import Footer from '../../Layout/Footer';
import Headers from '../../Layout/Header';

export default class AccomodationsList extends Component {
  render() {
    console.log('ici');
    return (
      <div>
        <Headers />
        <div style={{ marginTop: '70px' }}>
          AccomodationsList la page
        </div>
        <Footer />
      </div>
    );
  }
}
