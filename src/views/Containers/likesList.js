import React, { Component } from 'react';
import { Container, Col, ListGroup, Card, Row, Button, Badge } from 'react-bootstrap';
import { apiUrl } from '../../router';
import swal from 'sweetalert';
import backgroundImg from '../../Pictures/Shrug-Emoji.jpg';
import LoadingComponent from './LoadingComponent';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class LikesList extends Component {

    constructor() {
        super();
        this.state = {
            accomodations: [],
            targetAcc: null,
            loading: 0,
        }
    }

    abortController = new AbortController();

    getLikes = () => {        
        const signal = this.abortController.signal;
        fetch(`${apiUrl}getlikes`, {
            method: 'get',
            headers: {
                'Authorization': JSON.parse(sessionStorage.getItem('userData')).token.api_token
            },
            signal: signal
        })
            .then(res => res.json())
            .then(res => {
                if (res.status === 'success') {
                    this.setState({ accomodations: res.response, targetAcc: res.response[0] });
                    console.log(res.response[0])
                }
            });
    }

    componentDidMount() {
        this.getLikes();
    }

    componentWillUnmount() {
        this.abortController.abort();
    }    

    render() {
        let acc = this.state.targetAcc;
        setTimeout(() => this.setState({ loading: 1 }), 5000);
        return (
            <Container>
                <h1>Mes favoris</h1>
                {
                    !this.state.loading
                        ?
                        <LoadingComponent />
                        :
                        this.state.accomodations.length < 1
                            ?
                            <div style={styles.image}>
                                <div style={styles.emptyList}>
                                    Vous n'avez aucun logement en favoris
                                </div>
                            </div>
                            :
                            <Row>
                                <Col xs='4'>
                                    <ListGroup>
                                        {
                                            this.state.accomodations.map(acc =>
                                                <ListGroup.Item
                                                    key={this.state.accomodations.indexOf(acc)}
                                                    action
                                                    onClick={() => this.setState({ targetAcc: acc })}
                                                    variant={acc.isStillFree ? 'success' : 'danger'}
                                                >
                                                    <h5>{acc.Title}</h5>
                                                    <Badge>{acc.isStillFree ? 'Disponible' : 'Loué'}</Badge>
                                                </ListGroup.Item>
                                            )
                                        }
                                    </ListGroup>
                                </Col>
                                <Col>
                                    <Card>
                                        <Card.Header>
                                            <Card.Title>{acc.Title}</Card.Title>
                                        </Card.Header>
                                        <Card.Body>
                                            <h1><Badge variant='primary'>Prix :</Badge> {acc.priceRent + acc.priceCharges} €</h1>
                                            <h5>{acc.priceRent} € de loyer + {acc.priceCharges} € de charges</h5>
                                            <hr />
                                            <h5>Visité</h5>
                                            <div>{moment(acc.visitDate).add(2, 'weeks') <= moment() ? moment(acc.visitDate).format('dddd Do MMMM YYYY à H:mm') : moment(acc.visitDate).fromNow()}</div>
                                            <br />
                                            <h5>Annonceur</h5>
                                            <div>{acc.owner}</div>
                                            <br />
                                            <h5>Nombre de visite : <Badge variant="warning">{acc.nbVisit}</Badge></h5>
                                            <h5>Nombre d'intéressé : <Badge variant="warning">{acc.nbInterested}</Badge></h5>
                                            <br />
                                            <h5>Mis à disposition</h5>
                                            <Row>
                                                <Col xs={3}><FontAwesomeIcon icon={["fas", "bed"]} /> {acc.nbRoom} chambres</Col>
                                                {
                                                    acc.HasWifi === 1
                                                        ?
                                                        <Col xs={2}>
                                                            <FontAwesomeIcon icon={["fas", "wifi"]} /> WiFi
                                                        </Col>
                                                        :
                                                        null
                                                }
                                                {
                                                    acc.HasCarPark === 1
                                                        ?
                                                        <Col xs={2}><FontAwesomeIcon icon={["fas", "car"]} /> Parking</Col>
                                                        :
                                                        null
                                                }
                                                <Col xs={2}>{acc.Surface} m<sup>2</sup></Col>
                                            </Row>
                                            <br />
                                            <h5>Description</h5>
                                            <div>{acc.Description}</div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                }
            </Container>
        )
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