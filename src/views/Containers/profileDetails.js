import React, { Component } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import moment from 'moment';
import 'moment/locale/fr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import swal from 'sweetalert';
import { apiUrl } from '../../router';

export default class ProfileDetails extends Component {

    constructor() {
        super();
        this.state = {
            toEdit: true,
            email: '',
            Firstname: '',
            Surname: '',
        }
    }

    editInformations = () => {
        if (this.state.email === "") {
            this.setState({ email: this.props.user.email })
        }
        if (this.state.Firstname === "") {
            this.setState({ Firstname: this.props.user.Firstname })
        }
        if (this.state.Surname === "") {
            this.setState({ Surname: this.props.user.Surname })
        }
        swal({
            text: 'Etes-vous sûr de modifier ces informations ?',
            button: {
                closeModal: false
            }
        }).then(() => {
            let data = new FormData();
            data.append('firstname', this.state.Firstname);
            data.append('surname', this.state.Surname);
            data.append('email', this.state.email);
            fetch(`${apiUrl}resetinfo`, {
                method: 'post',
                headers: {
                    'Authorization': JSON.parse(sessionStorage.getItem('userData')).token.api_token
                },
                body: data
            }).then(response => response.json())
                .then(res => {
                    if (res.status === 'error') {
                        swal({
                            text: res.response[0],
                            dangerMode: true,
                            icon: 'warning'
                        })
                    } else {
                        swal({
                            title: 'Parfait',
                            text: res.response,
                            icon: 'success'
                        }).then(() => {
                            this.setState({ toEdit: true });
                            console.log({ 'email': this.state.email, "firstname": this.state.Firstname, "surname": this.state.Surname, "default-Value": this.props.user });
                        })
                    }
                })

        })
    }

    render() {
        let user = this.props.user;
        return (
            <div>
                <Row>
                    <Col xs='9'>
                        <h2>Informations Générales</h2>
                    </Col>
                    <Col xs='3'>
                        {
                            this.state.toEdit
                                ?
                                <Button
                                    style={{ width: '100%' }}
                                    variant='outline-secondary'
                                    onClick={() => this.setState({ toEdit: false })}
                                >
                                    Modifier <FontAwesomeIcon icon={["fas", "edit"]} />
                                </Button>
                                :
                                <Button
                                    style={{ width: '100%' }}
                                    variant='outline-success'
                                    onClick={() => this.editInformations()}
                                >
                                    Confirmer <FontAwesomeIcon icon={["fas", "check"]} />
                                </Button>
                        }
                    </Col>
                </Row>
                <hr />
                <Form>
                    <Form.Group as={Row} controlId="formPlaintextEmail">
                        <Form.Label column sm="3">
                            Adresse e-mail
                        </Form.Label>
                        <Col sm="9">
                            <Form.Control plaintext={this.state.toEdit} defaultValue={user.email} onChange={(e) => this.setState({ email: e.target.value })} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextEmail">
                        <Form.Label column sm="3">
                            Prénom
                        </Form.Label>
                        <Col sm="9">
                            <Form.Control plaintext={this.state.toEdit} defaultValue={user.Firstname} onChange={(e) => this.setState({ Firstname: e.target.value })} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextEmail">
                        <Form.Label column sm="3">
                            Nom
                        </Form.Label>
                        <Col sm="9">
                            <Form.Control plaintext={this.state.toEdit} defaultValue={user.Surname} onChange={(e) => this.setState({ Surname: e.target.value })} />
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
            </div>
        )
    }
}