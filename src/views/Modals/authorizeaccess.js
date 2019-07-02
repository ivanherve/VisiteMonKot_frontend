import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { apiUrl } from '../../router';
import swal from 'sweetalert';

export default class AuthoriseAccess extends Component {

    authorizeuser = (uid) => {
        console.log(uid)
        /*
        let data = new FormData();
        data.append('uid', uid)
        fetch(`${apiUrl}authorizeuser`, {
            method: 'post',
            headers: {
                api_token: JSON.parse(sessionStorage.getItem('userData')).token.api_token
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
            */
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.hide} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Autoriser l'accès de {this.props.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Etes-vous sûr de vouloir ré-attribuer les droits de <strong>{this.props.name}</strong> ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-success' onClick={() => this.removeaccess(this.props.uid)}>AUTORISER</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}