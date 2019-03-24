import React, { Component } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

export default class ResetPwd extends Component {
    render() {
        return (
            <Container>
                <div style={{marginTop: '10px'}}>
                <h1>Modifier son mot de passe</h1>
                <Form>
                    <Form.Control
                        type="password"
                        name="old password"
                        minLength={8}
                        placeholder="Tapez votre ancien mot de passe"
                    />
                    <br />
                    <Form.Control
                        type="password"
                        name="new password"
                        minLength={8}
                        placeholder="Tapez votre nouveau mot de passe"
                    />
                    <br />
                    <Form.Control
                        type="password"
                        name="confirm new password"
                        minLength={8}
                        placeholder="Retapez votre nouveau mot de passe"
                    />
                    <br />
                </Form>
                <Button variant="success">
                    Changer de mot de passe
                </Button>
                </div>
            </Container>
        )
    }
}