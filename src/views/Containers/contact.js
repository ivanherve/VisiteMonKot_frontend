import React, { Component } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

export default class Contact extends Component {
    render() {
        return (
            <Container>
                <div style={{marginTop: '10px'}}>
                <h1>Contacter l'équipe VisiteMonKot</h1>
                <Form>
                    <Form.Control
                        type="text"
                        as="textarea"
                        name="message"
                        placeholder="Chers Administrateurs, ... "
                        style={{minHeight: '200px'}}
                    />
                    <br />
                </Form>
                <Button variant="success">
                    Envoyer un message
                </Button>
                </div>
            </Container>
        )
    }
}