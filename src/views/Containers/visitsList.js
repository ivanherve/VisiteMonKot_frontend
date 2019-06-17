import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React, { Component } from 'react';
import { Badge, Button, Card, Col, Container, ListGroup, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import '../../App.css';
import backgroundImg from '../../Pictures/Shrug-Emoji.jpg';
import { apiUrl } from '../../router';
import VisitorChangeDate from '../Modals/visitorChangeDate';
import CancelVisit from '../Modals/cancelVisit';

export default class VisitsList extends Component {
    constructor() {
        super();
        this.state = {
            accomodations: [],
            targetAcc: {},
            showChangeDate: false,
            dateVisitAcc: {},
            showCancel: false,
        }
    }

    getDatesVisit = (id) => {
        fetch(`${apiUrl}getvisitdates/${id}`, {
            method: 'get',
            headers: {
                api_token: JSON.parse(sessionStorage.getItem('userData')).token.api_token
            }
        }).then(response => response.json())
            .then(res => {
                if (res.status === 'error') {
                    //alert(res.response[0]);
                    console.log(res.response)
                } else {
                    this.setState({ dateVisitAcc: Object.values(res.response) })
                }
            })
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
                    //alert(res.response[0]);
                    console.log(res.response)
                } else {
                    this.setState({ accomodations: res.response });
                    this.setState({ targetAcc: res.response[0] });
                    this.getDatesVisit(res.response[0].accomodation_id)
                    console.log(res.response)
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
                                            <ListGroup.Item
                                                key={this.state.accomodations.indexOf(acc)}
                                                onClick={() => {
                                                    this.setState({ targetAcc: acc });
                                                    this.getDatesVisit(acc.accomodation_id)
                                                }}
                                                action
                                                variant={acc.isStillFree === 0 ? "danger" : acc.nbVisit > 2 ? "warning" : "success"}
                                            >
                                                <h5>{acc.Title}</h5>
                                                <i>{moment(acc.visitDate).format('LLLL')}</i>
                                            </ListGroup.Item>
                                        )
                                    }
                                </ListGroup>
                            </Col>
                            <Col>
                                <Card>
                                    <Card.Header>
                                        <Row>
                                            <Col xs={7}>
                                                <Card.Title>{acc.Title}</Card.Title>
                                            </Col>
                                            <Col xs={4}>
                                                <Button style={{ width: '100%' }} variant='outline-success' onClick={() => this.setState({ showChangeDate: true })}>
                                                    Changer de date <FontAwesomeIcon icon={["fas", "edit"]} />
                                                </Button>
                                            </Col>
                                            <Col xs={1}>
                                                <OverlayTrigger
                                                    overlay={
                                                        <Tooltip>
                                                            Annuler Visite
                                                        </Tooltip>
                                                    }
                                                >
                                                    <Button variant='outline-danger' onClick={() => this.setState({ showCancel: true })}><FontAwesomeIcon icon={["fas", "times"]} /></Button>
                                                </OverlayTrigger>
                                            </Col>
                                        </Row></Card.Header>
                                    <Card.Body>
                                        <h1><Badge variant='primary'>Prix :</Badge> {acc.priceRent + acc.priceCharges} €</h1>
                                        <h5>{acc.priceRent} € de loyer + {acc.priceCharges} € de charges</h5>
                                        <hr />
                                        <h5>Visite prévu le </h5>
                                        <p>{moment(acc.visitDate).format('dddd Do MMMM YYYY')}</p>
                                        <h5>Annonceur</h5>
                                        <p>{acc.owner}</p>
                                        <h5>Nb de visites: <Badge variant="warning">{acc.nbVisit}</Badge></h5>
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
                <VisitorChangeDate
                    show={this.state.showChangeDate}
                    hide={() => this.setState({ showChangeDate: false })}
                    date={acc.visitDate}
                    dates={this.state.dateVisitAcc}
                />
                <CancelVisit
                    show={this.state.showCancel}
                    hide={() => this.setState({ showCancel: false })}
                    title={acc.Title}
                    date={acc.visitDate}
                    aid={acc.accomodation_id}
                />
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