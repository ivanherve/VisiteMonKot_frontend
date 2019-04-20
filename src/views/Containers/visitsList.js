import React, { Component } from 'react';
import { ListGroup, Container, Col, Card, Row, Button, Overlay, OverlayTrigger, Tooltip, Badge } from 'react-bootstrap';
import '../../App.css';
import backgroundImg from '../../Pictures/Shrug-Emoji.jpg';
import { apiUrl } from '../../router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';

export default class VisitsList extends Component {
    constructor() {
        super();
        this.state = {
            accomodations: [],
            targetAcc: {},
        }
    }

    getVisits = () => {
        fetch(apiUrl + 'getvisits', {
            method: 'get',
            headers: {
                api_token: JSON.parse(sessionStorage.getItem('userData')).token.api_token
            }
        })
            .then(response => response.json())
            .then(res => {
                if (res.status === 'error') {
                    alert(res.response[0]);
                    console.log(res.response)
                } else {
                    this.setState({ accomodations: res.response });
                    this.setState({ targetAcc: res.response[0] })
                }
            })
    }
    componentDidMount() {
        this.getVisits();
    }
    render() {
        let acc = this.state.targetAcc;
        return (
            <Container>
                <h1>Mes visites</h1>
                {
                    this.state.accomodations.length > 0
                        ?
                        <Row>
                            <Col xs={4}>
                                <ListGroup variant='flush'>
                                    {
                                        this.state.accomodations.map(acc =>
                                            <ListGroup.Item onClick={() => this.setState({ targetAcc: acc })} action variant={acc.isStillFree === 0 ? "danger" : acc.nbVisit > 0 ? "warning" : "success"}>
                                                <h5>{acc.Title}</h5>
                                                <i>{acc.visitDate}</i>
                                            </ListGroup.Item>
                                        )
                                    }
                                </ListGroup>
                            </Col>
                            <Col>
                                <Card>
                                    <Card.Header>
                                        <Row>
                                            <Col xs={11}>
                                                <Card.Title>{acc.Title}</Card.Title>
                                            </Col>
                                            <Col xs={1}>
                                                <OverlayTrigger
                                                    overlay={
                                                        <Tooltip>
                                                            Annuler Visite
                                                        </Tooltip>
                                                    }
                                                >
                                                    <Button variant='outline-danger'><FontAwesomeIcon icon={["fas", "times"]} /></Button>
                                                </OverlayTrigger>
                                            </Col>
                                        </Row></Card.Header>
                                    <Card.Body>
                                        <h1><Badge variant='primary'>Prix :</Badge> {acc.priceRent + acc.priceCharges} €</h1>
                                        <h5>{acc.priceRent} € de loyer + {acc.priceCharges} € de charges</h5>
                                        <hr />
                                        <h5>Visite prévu le </h5>
                                        <p>{moment(acc.visitDate).format('LLLL')}</p>
                                        <h5>Annonceur</h5>
                                        <p>{acc.owner}</p>
                                        <h5>Mis à disposition</h5>
                                        <Row>
                                            <Col xs={2}>{acc.nbVisit} visites</Col>
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
                                        <p></p>
                                        <h5>Description</h5>
                                        {acc.Description}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        :
                        <div style={styles.image}>
                            <div style={styles.emptyList}>
                                Vous n'avez aucune visite pour le moment
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