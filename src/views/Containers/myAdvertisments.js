import React, { Component } from 'react';
import { ListGroup, Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import '../../App.css';
import backgroundImg from '../../Pictures/Shrug-Emoji.jpg';
import AddAnnounce from '../Modals/addAnnounce';

export default class MyAdvertisments extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      showModal: false,
    };
  }
  handleShow() {
    this.setState({ showModal: true })
  }

  handleClose() {
    this.setState({ showModal: false })
  }

  render() {
    return (
      <Container>
        <h1>Annonces</h1>
        <Row style={{ marginBottom: '10px' }}>
          <Col xs={6}>
            <Button style={{ width: '100%' }} variant="success" onClick={this.handleShow}>Annoncer un logement</Button>
          </Col>
          <Col xs={6}>
            <Button style={{ width: '100%' }} variant="danger" disabled={!this.state.isThereAccomo}>Supprimer un logement</Button>
          </Col>
        </Row>
        <AddAnnounce
          showModal={this.state.showModal}
          handleClose={this.handleClose}
        />
        {
          this.state.isThereAccomo
            ?
            <ListGroup>
              <ListGroup.Item variant="success">Available</ListGroup.Item>
              <ListGroup.Item variant="danger">Taken</ListGroup.Item>
              <ListGroup.Item variant="warning">Visited</ListGroup.Item>
            </ListGroup>
            :
            <div style={styles.image}>

              <div style={styles.emptyList}>
                Vous n'avez annoncé aucun logement
              </div>
            </div>
        }
      </Container>
    );
  }
}

const styles = {
  emptyList: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#00f',
    backgroundColor: 'rgba(255, 255, 255,0.8)'
  },
  image: {
    backgroundImage: 'url(' + backgroundImg + ')',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }
}