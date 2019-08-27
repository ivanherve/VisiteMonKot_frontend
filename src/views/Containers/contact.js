import React, { Component } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { apiUrl } from '../../router';
import swal from 'sweetalert';

export default class Contact extends Component {
    constructor() {
        super();
        this.state = {
            message: '',
        }
    }

    sendMsg = () => {
        let data = new FormData();
        data.append('message',this.state.message);
        fetch(`${apiUrl}mail`, {
            method: 'post',
            headers: {
                'Authorization': JSON.parse(sessionStorage.getItem('userData')).token.api_token
            },
            body: data
        }).then(res => res.json())
        .then(res => {
            if(res.status === 'success'){
                swal("Merci!",res.response,'success')
                .then(() => window.location.reload())
            } else {
                swal("Attention",res.response[0],"warning")
            }
        })
        .catch(err => {
            swal("Oups!", "Une erreur est survenue", "error");
            console.log(err)
        })
    }

    render() {
        return (
            <Container>
                <div style={{ marginTop: '10px' }}>
                    <h1>Contacter l'équipe VisiteMonKot</h1>
                    <Form>
                        <Form.Control
                            type="text"
                            as="textarea"
                            name="message"
                            placeholder="Chers Administrateurs, ... "
                            style={{ minHeight: '200px' }}
                            onChange={e => this.setState({ message: e.target.value })}
                        />
                        <br />
                    </Form>
                    <Button variant="success" onClick={() => this.sendMsg()}>
                        Envoyer un message
                    </Button>
                </div>
            </Container>
        )
    }
}