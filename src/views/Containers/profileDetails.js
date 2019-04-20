import React, { Component } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import moment from 'moment';
import 'moment/locale/fr';

export default class ProfileDetails extends Component {
    render() {
        let user = this.props.user;
        return (
            <div>
                <h2>Informations Générales</h2>
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
            </div>
        )
    }
}