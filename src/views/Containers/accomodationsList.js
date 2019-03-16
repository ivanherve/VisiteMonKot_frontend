import React, { Component } from 'react';
import { ListGroup, Container, Row, Col } from 'react-bootstrap';
import '../../App.css';
import Footer from '../../Layout/Footer';
import Headers from '../../Layout/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class AccomodationsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accomodations: []
    }
  }

  fetchAccomodations = () => {
    fetch('http://localhost:8000/accomodations')
      .then(response => response.json())
      .then(res => {
        if (res.status === 'error') {
          alert(res.response[0]);
          console.log(res.response[1]);
        } else {
          this.setState({ accomodations: res.response })
        }
      })
  }

  componentDidMount() {
    this.fetchAccomodations();
  }

  render() {
    return (
      <Container>
        <h1>Logement</h1>
        <ListGroup>
          {
            this.state.accomodations.map(accomo =>
              accomo.isStillFree == 0
                ?
                <AccomodationItem key={this.state.accomodations.indexOf(accomo)} accomo={accomo} variant="danger" />
                :
                accomo.nbVisit < 1
                  ?
                  <AccomodationItem key={this.state.accomodations.indexOf(accomo)} accomo={accomo} variant="success" />
                  :
                  <AccomodationItem key={this.state.accomodations.indexOf(accomo)} accomo={accomo} variant="warning" />
            )
          }
        </ListGroup>
      </Container>
    );
  }
}

const AccomodationItem = ({accomo, key, variant}) => {
  return (
    <ListGroup.Item key={key} variant={variant}>
      <h3>{accomo.Title}</h3>
      <h1><p style={{ fontWeight: 'bolder', fontSize: '3rem' }}>{accomo.priceRent + accomo.priceCharges} € </p></h1>
      <p style={{ fontStyle: 'italic', fontSize: '1.5rem' }}>
        <strong>{accomo.priceRent} €</strong> de loyer + <strong>{accomo.priceCharges} €</strong> de charges
      </p>
      <Row>
        <Col xs={2}><FontAwesomeIcon icon={["fas", "bed"]}/> {accomo.nbRoom} chambres</Col>
        {
          accomo.HasWifi == 1
          ?
          <Col xs={2}><FontAwesomeIcon icon={["fas", "wifi"]}/> WiFi</Col>
          :
          null
        }
        {
          accomo.HasCarPark == 1
          ?
          <Col xs={2}><FontAwesomeIcon icon={["fas", "car"]}/> {accomo.HasCarPark} Parking</Col>
          :
          null
        }        
        <Col xs={2}>{accomo.nbVisit} visites</Col>
        <Col xs={2}>{accomo.Surface} m<sup>2</sup></Col>
      </Row>
    </ListGroup.Item>
  )
}
