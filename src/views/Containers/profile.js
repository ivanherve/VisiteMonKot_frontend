import moment from 'moment';
import 'moment/locale/fr';
import React, { Component } from 'react';
import { Card, Col, Container, ListGroup, Row, Form } from 'react-bootstrap';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import ProfilePic from '../../logo/default-profile-picture.png';
import ProfileDetails from './profileDetails';
import ResetPwd from './resetpwd';
import swal from '@sweetalert/with-react';
import { apiUrl } from '../../router';

export default class Profile extends Component {

    constructor() {
        super();
        this.state = {
            password: null,
            feedback: null,
        }
    }

    deleteAccount = () => {
        swal({
            text: "Veuillez d'abord entrer votre mot de passe",
            content: (
                <div>
                    <Form.Control type='password' onChange={e => this.setState({ password: e.target.value })} />
                </div>
            ),
            button: 'Continuer'
        })
            .then(() => {
                swal({
                    icon: 'warning',
                    content: (
                        <div>
                            <h5>Attention!</h5>
                            <p>En supprimant votre compte, vous supprimez toutes vos visites ainsi que vos logements et leurs visites.</p>
                            <p>Êtes-vous sûr de vouloir continuer ?</p>
                            <hr />
                            <p>Pouvez-vous nous dire la/les raison(s) pour laquelle/lesquelles vous voulez quitter VisiteMonKot ?</p>
                            <Form.Control as='textarea' onChange={e => this.setState({ feedback: e.target.value })} required />
                        </div>
                    ),
                    button: 'Continuer'
                })
                    .then(() => {
                        let data = new FormData();
                        data.append('password', this.state.password);
                        data.append('feedback', this.state.feedback);
                        fetch(`${apiUrl}deleteaccount`, {
                            method: 'post',
                            headers: {
                                'Authorization': JSON.parse(sessionStorage.getItem('userData')).token.api_token
                            },
                            body: data
                        })
                            .then(res => res.json())
                            .then(res => {
                                if (res.status === 'success') {
                                    sessionStorage.setItem('userData', '');
                                    sessionStorage.clear();
                                    swal({
                                        title: 'Au revoir!',
                                        text: res.response
                                    })
                                    .then(() => window.location.reload());                                    
                                } else {
                                    swal({
                                        icon: 'warning',
                                        text: res.response[0]
                                    })
                                }
                            })
                            .catch(err => {
                                swal("Oups!", "Une erreur est survenue", "error");
                                console.log(err)
                            })
                    })
                    .catch(err => {
                        swal("Oups!", "Une erreur est survenue", "error");
                        console.log(err)
                    })
            })

    }

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
                                <Card.Header>
                                    <Card.Title>{user.Firstname} {user.Surname}</Card.Title>
                                </Card.Header>
                                <ListGroup className="list-group-flush">
                                    <Link to={'/profile/' + user.user_id} className="list-group-item">Modifier mes informations personnelles</Link>
                                    <Link to={'/profile/resetpwd/' + user.user_id} className="list-group-item">Modifier mon mot de passe</Link>
                                    <ListGroup.Item style={styles.delAccount} variant="danger" onClick={() => this.deleteAccount()}>
                                        Supprimer mon compte
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                        <Col xs={9}>
                            <Switch>
                                <Route path={'/profile/' + user.user_id} render={() => <ProfileDetails user={user} />} />
                                <Route path={'/profile/resetpwd/' + user.user_id} render={() => <ResetPwd />} />
                                <Redirect from='/profile' to={'/profile/' + user.user_id} />
                            </Switch>
                        </Col>
                    </Row>
                </div>
            </Container>
        )
    }
}

const styles = {
    delAccount: {
        cursor: 'pointer',
    }
}