import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import moment from 'moment';
import { apiUrl } from '../../router';
import swal from 'sweetalert';

export default class CancelVisit extends Component {

    deleteVisit = (aid) => {
        let data = new FormData();
        data.append('aid', aid);
        fetch(`${apiUrl}deletevisit`, {
            method: 'post',
            headers: {
                'Authorization': JSON.parse(sessionStorage.getItem('userData')).token.api_token
            },
            body: data
        })
            .then(response => response.json())
            .then(res => {
                if (res.status === 'error') {
                    swal({
                        text: res.response[0],
                        dangerMode: true,
                        icon: 'warning'
                    })
                } else {
                    swal({
                        text: res.response,
                        icon: 'success',
                        button: {
                            closeModal: false,
                        }
                    })
                        .then(() => {
                            this.props.hide();
                            window.location.reload();
                        });
                }
            })
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.hide} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Annuler la visite</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Etes-vous sûr de vouloir annuler la visite de "<i>{this.props.title}</i>" prévu le <strong>{moment(this.props.date).format('LL')} à {moment(this.props.date).format('HH:mm')}</strong> ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-danger' onClick={() => this.deleteVisit(this.props.aid)}>ANNULER</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}