import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { Button, Col, Container, ListGroup, Row } from 'react-bootstrap';
import '../../App.css';
import backgroundImg from '../../Pictures/Shrug-Emoji.jpg';
import { apiUrl } from '../../router';
import AddAnnounce from '../Modals/addAnnounce';
import DetailsAdvertisment from './detailsAdvertisment';

export default class MyAdvertisments extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      showModal: false,
      advertisments: [],
      accomodation_id: '',
      oneAd: {},
    };
  }

  handleShow() {
    this.setState({ showModal: true })
  }

  handleClose() {
    this.setState({ showModal: false })
  }

  getAdvertisment = () => {
    fetch(apiUrl + 'advertisments', {
      method: 'GET',
      headers: {
        api_token: JSON.parse(sessionStorage.getItem('userData')).token.api_token
      }
    })
      .then(response => response.json())
      .then(res => {
        if (res.status === 'success') {
          this.setState({ advertisments: res.response });
          this.setState({ isThereAccomo: true });
          this.setState({ oneAd: res.response[0] });
          console.log(res.response)
        } else {
          this.setState({ isThereAccomo: false });
          console.log(res.response)
        }
      })
  }

  showAd = (ad) => {
    this.setState({ oneAd: ad })
  }

  componentDidMount() {
    this.getAdvertisment();
  }

  render() {
    return (
      <Container>
        <h1>Annonces</h1>
        <Button style={{ width: '100%', margin: '10px 0 10px 0' }} variant="outline-success" onClick={this.handleShow}><FontAwesomeIcon icon={["fas", "plus"]} /> Annoncer un logement</Button>
        <AddAnnounce
          showModal={this.state.showModal}
          handleClose={this.handleClose}
        />
        {
          this.state.isThereAccomo
            ?
            <Row>
              <Col xs={5}>
                <ListGroup>
                  {
                    this.state.advertisments.map(adv =>
                      <ListGroup.Item
                        action
                        onClick={() => { console.log(adv); this.setState({ oneAd: adv }) }}
                        key={adv.accomodation_id}
                        variant={adv.nbVisit > 0 ? "warning" : "success"}
                      >
                        <h5>{adv.Title} : {adv.priceRent + adv.priceCharges} €</h5>
                        <Row>
                          <Col>
                            <div>visites : {adv.nbVisit}</div>
                            <div style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>{adv.isStillFree === 1 ? 'Libre' : 'Loué'}</div>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    )
                  }
                </ListGroup>
              </Col>
              <Col>
                <DetailsAdvertisment
                  advertisment={this.state.oneAd}
                />
              </Col>
            </Row>

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