import React, { Component } from 'react';
import { ListGroup, Container } from 'react-bootstrap';
import '../../App.css';

export default class MyAdvertisments extends Component {
  render() {
    return (
      <Container>
        <h1>Annonces</h1>
        <ListGroup>
          <ListGroup.Item variant="success">Available</ListGroup.Item>
          <ListGroup.Item variant="danger">Taken</ListGroup.Item>
          <ListGroup.Item variant="warning">Visited</ListGroup.Item>
        </ListGroup>
      </Container>
    );
  }
}