import React, { Component } from 'react';
import { Container, Form, Button, Col, Row, Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import moment from 'moment';
import 'moment/locale/fr';
import ProfilePic from '../../Pictures/default-pic.jpg';

export default class Profile extends Component {
    render() {
        moment.locale('fr');
        let user = JSON.parse(sessionStorage.getItem('userData')).user;
        return (
            <Container>
                <div>
                    <Row style={{ marginTop: '80px' }}>
                        <Col xs={3}>
                            <Card>
                                <Card.Img variant="top" src={ProfilePic} />
                                <Card.Body>
                                    <Card.Title style={{ display: 'flex', justifyContent: 'center' }}>
                                        {user.Firstname} {user.Surname}
                                    </Card.Title>
                                    <Card.Text style={{ display: 'flex', justifyContent: 'center' }}>
                                        Some quick example text to build on the card title and make up the bulk of
                                        the card's content.
                                    </Card.Text>
                                </Card.Body>
                                <ListGroup className="list-group-flush">
                                    <ListGroupItem>
                                        Modifier mes informations personnelles
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        Modifier mon mot de passe
                                    </ListGroupItem>
                                    <ListGroupItem variant="danger">
                                        Supprimer mon compte
                                    </ListGroupItem>
                                </ListGroup>
                            </Card>
                        </Col>
                        <Col xs={9}>
                            <Form>
                                <Form.Group as={Row} controlId="formPlaintextEmail">
                                    <Form.Label column sm="3">
                                        Adresse e-mail
                                    </Form.Label>
                                    <Col sm="9">
                                        <Form.Control plaintext readOnly defaultValue={user.email} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="formPlaintextEmail">
                                    <Form.Label column sm="3">
                                        Date d'inscription
                                    </Form.Label>
                                    <Col sm="9">
                                        <Form.Control plaintext readOnly defaultValue={moment(user.create_time).format('LLLL')} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="formPlaintextEmail">
                                    <Form.Label column sm="3">
                                        Compte
                                    </Form.Label>
                                    {
                                        user.isAccountActive === 1
                                            ?
                                            <Col sm="9">
                                                <Form.Control plaintext readOnly defaultValue="Actif" style={{ color: 'green' }} />
                                            </Col>
                                            :
                                            <Col sm="9">
                                                <Form.Control plaintext readOnly defaultValue="Inactif" style={{ color: 'red' }} />
                                            </Col>
                                    }
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                </div>
            </Container>
        )
    }
}