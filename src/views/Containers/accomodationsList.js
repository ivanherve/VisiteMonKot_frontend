import React, { Component } from 'react';
import { ListGroup, Container } from 'react-bootstrap';
import '../../App.css';
import Footer from '../../Layout/Footer';
import Headers from '../../Layout/Header';

export default class AccomodationsList extends Component {
  render() {
    console.log('ici');
    return (
      <Container>
        <h1>Logement</h1>
        <ListGroup>
          <ListGroup.Item variant="success">Available</ListGroup.Item>
          <ListGroup.Item variant="danger">Taken</ListGroup.Item>
          <ListGroup.Item variant="warning">Visited</ListGroup.Item>
        </ListGroup>
      </Container>
    );
  }
}
