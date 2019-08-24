import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React, { Component } from 'react';
import { Badge, Button, Card, Col, Container, ListGroup, OverlayTrigger, Row, Tooltip, Form, Alert } from 'react-bootstrap';
import '../../App.css';
import backgroundImg from '../../Pictures/Shrug-Emoji.jpg';
import { apiUrl } from '../../router';
import VisitorChangeDate from '../Modals/visitorChangeDate';
import CancelVisit from '../Modals/cancelVisit';
import LoadingComponent from './LoadingComponent';
import swal from 'sweetalert';

export default class VisitsList extends Component {
    _isMounted = false;
    constructor() {
        super();
        this.state = {
            accomodations: [],
            targetAcc: {},
            showChangeDate: false,
            dateVisitAcc: {},
            showCancel: false,
            loading: null,
            filtred: [],
        }
    }

    getDatesVisit = (id) => {
        fetch(`${apiUrl}getvisitdates/${id}`, {
            method: 'get',
            headers: {
                'Authorization': JSON.parse(sessionStorage.getItem('userData')).token.api_token
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
                'Authorization': JSON.parse(sessionStorage.getItem('userData')).token.api_token
            },
            signal: this.abortController.signal
        })
            .then(response => response.json())
            .then(res => {
                if (res.status === 'error') {
                    //alert(res.response[0]);
                    console.log(res.response)
                } else {
                    this.setState({ accomodations: res.response, filtred: res.response });
                    this.setState({ targetAcc: res.response[0] });
                    this.getDatesVisit(res.response[0].accomodation_id)
                    console.log(res.response)
                }
            })
    }

    interested = (aid) => {
        let data = new FormData();
        data.append('aid', aid);
        fetch(`${apiUrl}likeaccomodation`, {
            method: 'post',
            headers: {
                'Authorization': JSON.parse(sessionStorage.getItem('userData')).token.api_token
            },
            body: data
        })
            .then(res => res.json())
            .then(res => {
                if (res.status === 'success') {
                    swal({
                        icon: 'success',
                        text: res.response
                    }).then(() => {
                        window.location.reload();
                    });
                } else {
                    swal({
                        icon: 'warning',
                        text: res.response[0]
                    })
                }
            })
    }

    notInterested = (aid) => {
        let data = new FormData();
        data.append('aid', aid);
        fetch(`${apiUrl}dislikeaccomodation`, {
            method: 'post',
            headers: {
                'Authorization': JSON.parse(sessionStorage.getItem('userData')).token.api_token
            },
            body: data
        })
            .then(res => res.json())
            .then(res => {
                if (res.status === 'success') {
                    swal({
                        icon: 'success',
                        text: res.response
                    }).then(() => {
                        window.location.reload();
                    });
                } else {
                    swal({
                        icon: 'warning',
                        text: res.response[0]
                    })
                }
            })
    }

    notVisitedYet = () => {
        this.setState({
            filtred: this.state.accomodations.filter(acc => {
                return acc.visitDate > moment().format("YYYY-MM-DD H:mm");
            }),
            //targetAcc: this.state.accomodations[0]
        })
    }

    visited = () => {
        /**/
        this.setState({
            filtred: this.state.accomodations.filter(acc => {
                return acc.visitDate < moment().format("YYYY-MM-DD H:mm");
            })
        })
    }

    abortController = new AbortController();

    componentDidMount() {
        //this._isMounted = true;
        this.getVisits();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.filtred !== prevState.filtred) {
            if (!this.state.targetAcc) this.setState({ targetAcc: this.state.filtred[0] });
        }
    }

    componentWillUnmount() {
        //this._isMounted = false;
        //this.abortController.abort();
    }

    render() {
        let accs = this.state.filtred;
        let acc = this.state.targetAcc;
        setTimeout(() => this.setState({ loading: 1 }), 5000);
        return (
            <Container>
                <h1>Mes visites</h1>
                {
                    !this.state.loading
                        ?
                        <LoadingComponent />
                        :
                        <div>
                            <Alert variant='info'>
                                <h5>Filtrer :</h5>
                                <Row>
                                    <Col><Form.Check custom id="f1" type='radio' name='filter' label='Tout' onChange={() => this.setState({ filtred: this.state.accomodations, targetAcc: this.state.accomodations[0] })} /></Col>
                                    <Col><Form.Check custom id="f2" type='radio' name='filter' label='Déjà visité' onChange={() => this.visited()} /></Col>
                                    <Col><Form.Check custom id="f3" type='radio' name='filter' label='Pas encore visité' onChange={() => this.notVisitedYet()} /></Col>
                                </Row>
                            </Alert>
                            {
                                accs.length > 0
                                    ?
                                    <div>
                                        <Row>
                                            <Col xs={4}>
                                                <ListGroup variant='flush' style={{ overflowY: 'auto', height: '600px' }}>
                                                    {
                                                        accs.map(acc =>
                                                            <ListGroup.Item
                                                                key={accs.indexOf(acc)}
                                                                onClick={() => {
                                                                    this.setState({ targetAcc: acc });
                                                                    this.getDatesVisit(acc.accomodation_id)
                                                                }}
                                                                action
                                                                variant={acc.isStillFree === 0 ? "danger" : !acc.approved ? "warning" : "success"}
                                                            >
                                                                <h5>{acc.Title}</h5>
                                                                <i>{moment(acc.visitDate).format('LLLL')}</i>
                                                                <p>
                                                                    {
                                                                        acc.isStillFree === 0
                                                                            ?
                                                                            <Badge variant='danger'>Loué</Badge>
                                                                            :
                                                                            acc.approved
                                                                                ?
                                                                                <Badge variant='success'>Accepté</Badge>
                                                                                :
                                                                                <Badge variant='warning'>Pas encore confirmé</Badge>
                                                                    }
                                                                </p>
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
                                                                <Card.Text>
                                                                    {
                                                                        acc.approved
                                                                            ?
                                                                            <Badge variant='success'>Accepté</Badge>
                                                                            :
                                                                            <Badge variant='danger'>Pas encore confirmé</Badge>
                                                                    }

                                                                </Card.Text>
                                                            </Col>
                                                            <Col xs='5'>
                                                                <Row>
                                                                    <Col xs='9'>
                                                                        <Button style={{ width: '100%' }} variant='outline-secondary' onClick={() => this.setState({ showChangeDate: true })}>
                                                                            Changer de date <FontAwesomeIcon icon={["fas", "edit"]} />
                                                                        </Button>
                                                                    </Col>
                                                                    <Col>
                                                                        <OverlayTrigger
                                                                            overlay={
                                                                                <Tooltip>Annuler Visite</Tooltip>
                                                                            }
                                                                        >
                                                                            <Button style={{ width: '100%' }} disabled={acc.visitDate < moment().format('YYYY-MM-Do H:mm:ss')} variant='outline-danger' onClick={() => this.setState({ showCancel: true })}><FontAwesomeIcon icon={["fas", "times"]} /></Button>
                                                                        </OverlayTrigger>
                                                                    </Col>
                                                                </Row>
                                                                <br />
                                                                {
                                                                    acc.liked
                                                                        ?
                                                                        <Button
                                                                            style={{ width: '100%' }}
                                                                            variant='outline-warning'
                                                                            onClick={() => this.notInterested(acc.accomodation_id)}
                                                                        >
                                                                            <FontAwesomeIcon icon={["fas", "thumbs-down"]} /> Pas Intéressé
                                                                        </Button>
                                                                        :
                                                                        <Button
                                                                            style={{ width: '100%' }}
                                                                            variant='outline-success'
                                                                            onClick={() => this.interested(acc.accomodation_id)}
                                                                            disabled={acc.visitDate > moment().format("YYYY-MM-DD H:mm")}
                                                                        >
                                                                            <FontAwesomeIcon icon={["fas", "thumbs-up"]} /> Intéressé
                                                                        </Button>
                                                                }
                                                            </Col>
                                                        </Row>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <h1><Badge variant='primary'>Prix :</Badge> {acc.priceRent + acc.priceCharges} €</h1>
                                                        <h5>{acc.priceRent} € de loyer + {acc.priceCharges} € de charges</h5>
                                                        <hr />
                                                        <h5>Visite prévu le </h5>
                                                        <p>{moment(acc.visitDate).format('dddd Do MMMM YYYY à H:mm')}</p>
                                                        <h5>Annonceur</h5>
                                                        <p>{acc.owner}</p>
                                                        <h5>Nombre de visites: <Badge variant="warning">{acc.nbVisit}</Badge></h5>
                                                        <h5>Nombre d'interessé: <Badge variant="warning">{acc.nbInterested ? acc.nbInterested : 0}</Badge></h5>
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
                                    </div>
                                    :
                                    <div style={styles.image}>
                                        <div style={styles.emptyList}>
                                            Vous n'avez aucune visite pour le moment
                                        </div>
                                    </div>
                            }
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