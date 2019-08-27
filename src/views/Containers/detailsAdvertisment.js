import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import 'moment/locale/fr';
import React, { Component } from 'react';
import { Badge, Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import { apiUrl } from '../../router';
import EditAccomodation from '../Modals/editAccomodation';
import FreeAccomodation from '../Modals/freeAccomodation';
import RentAccomodation from '../Modals/rentAccomodation';
import VisitorsList from '../Modals/visitorsList';
import DatesVisit from '../Modals/datesVisit';
import swal from 'sweetalert';

export default class DetailsAdvertisment extends Component {
    constructor() {
        super();
        this.state = {
            showModal: false,
            showRent: false,
            showFree: false,
            showVisitors: false,
            showDatesV: false,
            visitors: [],
            datesVisit: [],
        }
    }

    getVisitors = (id) => {
        fetch(apiUrl + 'getvisitors/' + id, {
            method: 'get',
            headers: {
                'Authorization': JSON.parse(sessionStorage.getItem('userData')).token.api_token
            },
        })
            .then(response => response.json())
            .then(res => {
                if (res.status === 'error') {
                    console.log(res.response);
                    this.setState({ visitors: [] })
                } else {
                    console.log(res.response);
                    this.setState({ visitors: res.response })
                }
            })
            .catch(err => {
                swal("Oups!", "Une erreur est survenue", "error");
                console.log(err)
            })
    }

    fetchVisitDate = (id) => {
        fetch(`${apiUrl}getvisitdates/${id}`, {
            method: 'get',
            headers: {
                'Authorization': JSON.parse(sessionStorage.getItem('userData')).token.api_token
            }
        })
            .then(response => response.json())
            .then(res => {
                console.log(Object.values(res.response));
                if (res.status === 'error') {
                    swal(res.response)
                } else {
                    this.setState({ datesVisit: Object.values(res.response) });
                }
            })
            .catch(err => {
                swal("Oups!", "Une erreur est survenue", "error");
                console.log(err)
            })
    }

    componentDidMount() {
        console.log(this.props.advertisment);
        this.getVisitors(this.props.advertisment.accomodation_id);
        this.fetchVisitDate(this.props.advertisment.accomodation_id);
    }

    componentDidUpdate(nextProps) {
        /**/
        if (this.props.advertisment !== nextProps.advertisment) {
            this.getVisitors(this.props.advertisment.accomodation_id);
            this.fetchVisitDate(this.props.advertisment.accomodation_id);
            console.log([this.props.advertisment, nextProps, this.state.datesVisit, this.state.visitors]);
        }

    }

    render() {
        let adv = this.props.advertisment;
        let handleClose = () => this.setState({ showModal: false, showRent: false, showFree: false, showVisitors: false })
        return (
            <Card>
                <Card.Header closeButton bg="success">
                    <Row>
                        <Col xs={9}><Card.Title>{adv.Title}</Card.Title></Col>
                        <Col xs={3}>
                            <Button style={{ width: '100%' }} variant="outline-secondary" onClick={() => this.setState({ showModal: true })}>
                                Modifier <FontAwesomeIcon icon={["fas", "edit"]} />
                            </Button>
                            {
                                adv.isStillFree === 1
                                    ?
                                    <Button style={{ width: '100%', margin: '10px 0 10px 0' }} variant="outline-success" onClick={() => this.setState({ showRent: true })}>
                                        Loué <FontAwesomeIcon icon={["fas", "check"]} />
                                    </Button>
                                    :
                                    <Button style={{ width: '100%', margin: '10px 0 10px 0' }} variant="outline-warning" onClick={() => this.setState({ showFree: true })}>
                                        Libéré <FontAwesomeIcon icon={["fas", "check"]} />
                                    </Button>
                            }
                            <Button
                                style={{ width: '100%', margin: '10px 0 10px 0' }}
                                onClick={() => this.setState({ showVisitors: true })}
                                variant='outline-primary'
                            >
                                Visite à venir
                            </Button>
                            <Button
                                style={{ width: '100%', margin: '10px 0 10px 0' }}
                                variant='outline-danger'
                                onClick={() => this.setState({ showDatesV: true })}
                            >
                                Dates de visite
                            </Button>
                        </Col>
                    </Row>
                </Card.Header>
                <ListGroup variant="flush">
                    <ListGroup.Item>Prix des charges :      <Badge variant="info" style={{ fontSize: '1.25rem' }}>{adv.priceCharges} €</Badge></ListGroup.Item>
                    <ListGroup.Item>Prix du loyer :         <Badge variant="info" style={{ fontSize: '1.25rem' }}>{adv.priceRent} €</Badge></ListGroup.Item>
                    <ListGroup.Item>Date de publication :   {moment(adv.PublicationDate).add(2, 'hours').format('LL')} </ListGroup.Item>
                    <ListGroup.Item>Situation :                <Badge variant={adv.isStillFree === 1 ? "warning" : "success"} style={{ fontSize: '1.25rem' }}>{adv.isStillFree === 1 ? "Libre" : "Loué"}</Badge></ListGroup.Item>
                    <ListGroup.Item>Visité <Badge variant={adv.nbVisit > 0 ? "success" : "warning"} style={{ fontSize: '1rem' }}>{adv.nbVisit}</Badge> fois</ListGroup.Item>
                    <ListGroup.Item>Nombre d'intéressé : <Badge variant={adv.nbInterested > 0 ? "success" : "warning"} style={{ fontSize: '1rem' }}>{adv.nbInterested}</Badge></ListGroup.Item>
                    <ListGroup.Item>Adresse : {`${adv.address}, ${adv.cityName}`}</ListGroup.Item>
                </ListGroup>
                <EditAccomodation
                    handleClose={handleClose}
                    showModal={this.state.showModal}
                    adv={adv}
                />
                <RentAccomodation showModal={this.state.showRent} onHide={handleClose} accId={adv.accomodation_id} />
                <FreeAccomodation showModal={this.state.showFree} onHide={handleClose} accId={adv.accomodation_id} />
                <VisitorsList showModal={this.state.showVisitors} onHide={handleClose} visitors={this.state.visitors} />
                <DatesVisit show={this.state.showDatesV} hide={() => this.setState({ showDatesV: false })} dates={this.state.datesVisit} />
            </Card>
        )
    }
}