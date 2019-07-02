import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { apiUrl } from '../../router';
import swal from 'sweetalert';

export default class RemoveAccess extends Component {

    removeaccess = (uid) => {
        let data = new FormData();
        data.append('uid', uid)
        fetch(`${apiUrl}removeuser`, {
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