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

export default class DetailsAdvertisment extends Component {
    constructor() {
        super();
        this.state = {
            showModal: false,
            showRent: false,
            showFree: false,
            showVisitors: false,
            visitors: [],
        }
    }

    getVisitors = (id) => {
        fetch(apiUrl + 'getvisitors/' + id, {
            method: 'get',
            headers: {
                api_token: JSON.parse(sessionStorage.getItem('userData')).token.api_token
            },
        })
            .then(response => response.json())
            .then(res => {
                if (res.status === 'error') {
                    //swal(res.response);
                    console.log(res.response)
                } else {
                    console.log(res.response);
                    this.setState({ visitors: res.response })
                }
            })
    }

    componentDidMount() {
        console.log(this.props.advertisment);

    }

    componentDidUpdate(nextProps) {
        console.log(this.props.advertisment, [nextProps]);
        if (this.props.advertisment.accomodation_id !== nextProps.advertisment.accomodation_id) {
            this.getVisitors(this.props.advertisment.accomodation_id);
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
                                style={{ width: '100%' }}
                                onClick={() => this.setState({ showVisitors: true })}
                                variant='outline-primary'
                            >
                                Visite à venir
                            </Button>
                        </Col>
                    </Row>
                </Card.Header>
                <ListGroup variant="flush">
                    <ListGroup.Item>Prix des charges :      <Badge variant="info" style={{ fontSize: '1.25rem' }}>{adv.priceCharges} €</Badge></ListGroup.Item>
                    <ListGroup.Item>Prix du loyer :         <Badge variant="info" style={{ fontSize: '1.25rem' }}>{adv.priceRent} €</Badge></ListGroup.Item>
                    <ListGroup.Item>Date de publication :   {moment(adv.PublicationDate).add(2, 'hours').format('LL')} </ListGroup.Item>
                    <ListGroup.Item>Status :                <Badge variant={adv.isStillFree === 1 ? "warning" : "success"} style={{ fontSize: '1.25rem' }}>{adv.isStillFree === 1 ? "Libre" : "Loué"}</Badge></ListGroup.Item>
                    <ListGroup.Item>Visité <Badge variant={adv.nbVisit > 0 ? "success" : "warning"} style={{ fontSize: '1rem' }}>{adv.nbVisit}</Badge> fois</ListGroup.Item>
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
            </Card>
        )
    }
}