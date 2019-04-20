import React, { Component } from 'react';
import { Card, ListGroup, Col, Button, Row, Badge, Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import 'moment/locale/fr';
import EditAccomodation from './editAccomodation';
import RentAccomodation from './rentAccomodation';
import FreeAccomodation from './freeAccomodation';

export default class DetailsAdvertisment extends Component {
    constructor() {
        super();
        this.state = {
            showModal: false,
            showRent: false,
            showFree: false,
        }
    }

    componentDidMount() {
        console.log(this.props.advertisment)
    }

    componentDidUpdate() {
        console.log(this.props.advertisment)
    }

    render() {
        let adv = this.props.advertisment;
        let handleClose = () => this.setState({ showModal: false, showRent: false, showFree: false })
        return (
            <Card>
                <Card.Header closeButton bg="success">
                    <Row>
                        <Col xs={9}><Card.Title>{adv.Title}</Card.Title></Col>
                        <Col xs={3}>
                            <Button style={{ width: '100%' }} variant="outline-primary" onClick={() => this.setState({ showModal: true })}>
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
                        </Col>
                    </Row>
                </Card.Header>
                <ListGroup variant="flush">
                    <ListGroup.Item>Prix des charges :      <Badge variant="info" style={{ fontSize: '1.25rem' }}>{adv.priceCharges} €</Badge></ListGroup.Item>
                    <ListGroup.Item>Prix du loyer :         <Badge variant="info" style={{ fontSize: '1.25rem' }}>{adv.priceRent} €</Badge></ListGroup.Item>
                    <ListGroup.Item>Date de publication :   {moment(adv.PublicationDate).add(2, 'hours').format('LLLL')} </ListGroup.Item>
                    <ListGroup.Item>Status :                <Badge variant={adv.isStillFree === 1 ? "warning" : "success"} style={{ fontSize: '1.25rem' }}>{adv.isStillFree === 1 ? "Libre" : "Loué"}</Badge></ListGroup.Item>
                    <ListGroup.Item>Visité <Badge variant={adv.nbVisit > 0 ? "success" : "warning"} style={{ fontSize: '1rem' }}>{adv.nbVisit}</Badge> fois</ListGroup.Item>
                </ListGroup>
                <EditAccomodation
                    handleClose={handleClose}
                    showModal={this.state.showModal}
                    adv={adv}
                />
                <RentAccomodation showModal={this.state.showRent} onHide={handleClose} accId={adv.accomodation_id} />
                <FreeAccomodation showModal={this.state.showFree} onHide={handleClose} accId={adv.accomodation_id} />
            </Card>
        )
    }
}