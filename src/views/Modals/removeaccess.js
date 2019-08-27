import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { apiUrl } from '../../router';
import swal from '@sweetalert/with-react';

export default class RemoveAccess extends Component {

    constructor(){
        super();
        this.state = {
            password: '',
        }
    }

    removeaccess = (uid) => {
        swal({
            text: "Veuillez d'abord entrer votre mot de passe",
            button: 'Continuer'
        })
            .then(() => {
                let data = new FormData();
                data.append('uid', uid);
                data.append('password', this.state.password);
                fetch(`${apiUrl}removeuser`, {
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
                                icon: 'warning'
                            })
                        } else {
                            console.log(res.response);
                            swal({
                                text: res.response,
                                icon: 'success',
                            }).then(() => {
                                this.props.hide();
                                window.location.reload();
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

    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.hide} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Retirer les accès de {this.props.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Etes-vous sûr de vouloir retirer les accès de <strong>{this.props.name}</strong> ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-danger' onClick={() => this.removeaccess(this.props.uid)}>RETIRER</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}