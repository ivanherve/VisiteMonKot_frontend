import moment from 'moment';
import 'moment/locale/fr';
import React, { Component } from 'react';
import { Card, Col, Container, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import ProfilePic from '../../Pictures/testimonial-2.jpg';
import ProfileDetails from './profileDetails';
import ResetPwd from './resetpwd';

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
                                <ListGroup className="list-group-flush">
                                    <Link to={'/profile/'+user.user_id} className="list-group-item">Modifier mes informations personnelles</Link>
                                    <Link to={'/profile/resetpwd/'+user.user_id} className="list-group-item">Modifier mon mot de passe</Link>
                                    <ListGroupItem variant="danger" onClick={() => alert('lala')}>
                                        Supprimer mon compte
                                    </ListGroupItem>
                                </ListGroup>
                            </Card>
                        </Col>
                        <Col xs={9}>
                            <Switch>
                                <Route path={'/profile/'+user.user_id} render={() => <ProfileDetails user={user} />} />
                                <Route path={'/profile/resetpwd/'+user.user_id} render={() => <ResetPwd />} />
                                <Redirect from='/profile' to={'/profile/'+user.user_id} />
                            </Switch>
                        </Col>
                    </Row>
                </div>
            </Container>
        )
    }
}