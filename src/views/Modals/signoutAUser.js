import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { apiUrl } from '../../router';
import swal from 'sweetalert';

export default class SignOutAUser extends Component {

    signout = (uid) => {
        let data = new FormData();
        data.append('uid', uid);
        fetch(`${apiUrl}signoutauser`, {
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
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.hide} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Déconnecter {this.props.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Etes-vous sûr de vouloir déconnecter <strong>{this.props.name}</strong> ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-warning' onClick={() => this.signout(this.props.uid)}>DECONNECTER</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}