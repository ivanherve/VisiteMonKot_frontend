import React, { Component } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

export default class AdminEditInfo extends Component {
    render() {
        let user = this.props.user;
        let profiles = this.props.profiles;
        return (
            <Modal show={this.props.show} onHide={this.props.hide} centered size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Modifier</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group as={Row}>
                        <Form.Label column sm="2">E-mail</Form.Label>
                        <Col sm='10'>
                            <Form.Control type='text' placeholder={user.email} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="2">Nom</Form.Label>
                        <Col sm='10'>
                            <Form.Control type='text' placeholder={user.names} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="2">Profile</Form.Label>
                        <Col sm='10'>
                            <Form.Control as='select' defaultValue={user.profilName}>
                                {
                                    profiles.map(p =>
                                        <option key={profiles.indexOf(p)}>
                                            {p.profilName}
                                        </option>
                                    )
                                }
                            </Form.Control>

                        </Col>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button>MODIFIER</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}