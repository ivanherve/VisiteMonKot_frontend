import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { Col, Container, ListGroup, Row, Image, Button, Overlay, Form, FormControl } from 'react-bootstrap';
import '../../App.css';
import building from '../../Pictures/building.png';
import house from '../../Pictures/house-example.jpg';
import garage from '../../Pictures/garage-example.jpg';
import bedroom from '../../Pictures/bedroom-ex.jpg';
import { apiUrl } from '../../router';

export default class AccomodationsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accomodations: []
    }
  }

  fetchAccomodations = () => {
    fetch(apiUrl + 'accomodations')
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
        <h1>Logements</h1>
        <Form inline style={{marginBottom: '10px'}}>
          <FormControl type="text" placeholder="Nom de logement" style={{width: '88.25%'}} className="mr-sm-4" />
          <Button variant="outline-success">Rechercher</Button>
        </Form>
        <ListGroup>
          {
            this.state.accomodations.map(accomo =>
              accomo.isStillFree === 0
                ?
                <AccomodationItem key={this.state.accomodations.indexOf(accomo)} accomo={accomo} variant="danger" disabled />
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

const AccomodationItem = ({ accomo, key, variant }) => {
  let img;
  switch (accomo.type) {
    case 'Maison': img = house;
      break;
    case 'Appartement': img = building;
      break;
    case 'Kot': img = house;
      break;
    case 'Communautaire': img = house;
      break;
    case 'Duplex': img = house;
      break;
    case 'Studio': img = bedroom;
      break;
    case 'Garage': img = garage;
      break;
    default: img = house;
  }
  return (
    <ListGroup.Item key={key} variant={variant} >
      <Row>
        <Col xs={3}>
          <Image src={img} rounded />
          <div style={{ display: 'flex', justifyContent: 'center', fontSize: '1.5rem' }}>{accomo.type}</div>
        </Col>
        <Col md={{ offset: 1 }}>
          <Row>
            <Col>
              <h3>{accomo.Title}</h3>
              <h1><p style={{ fontWeight: 'bolder', fontSize: '3rem' }}>{accomo.priceRent + accomo.priceCharges} € </p></h1>
              <p style={{ fontStyle: 'italic', fontSize: '1.5rem' }}>
                <strong>{accomo.priceRent} €</strong> de loyer + <strong>{accomo.priceCharges} €</strong> de charges
              </p>
            </Col>
            {
              sessionStorage.getItem('userData')
                ?
                <Col>
                  <Button variant={variant} disabled={variant === 'danger'}>Visiter ?</Button>
                </Col>
                :
                <Col>
                  <Overlay>

                  </Overlay>
                  <Button variant={variant} disabled>Visiter ?</Button>
                </Col>
            }

          </Row>

          <Row>
            <Col xs={2}>{accomo.nbVisit} visites</Col>
            <Col xs={3}><FontAwesomeIcon icon={["fas", "bed"]} /> {accomo.nbRoom} chambres</Col>
            {
              accomo.HasWifi == 1
                ?
                <Col xs={2}><FontAwesomeIcon icon={["fas", "wifi"]} /> WiFi</Col>
                :
                null
            }
            {
              accomo.HasCarPark == 1
                ?
                <Col xs={2}><FontAwesomeIcon icon={["fas", "car"]} /> {accomo.HasCarPark} Parking</Col>
                :
                null
            }
            <Col xs={2}>{accomo.Surface} m<sup>2</sup></Col>
          </Row>
        </Col>
      </Row>
    </ListGroup.Item>
  )
}
