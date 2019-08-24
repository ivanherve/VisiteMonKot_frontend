import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { apiUrl } from '../../router';
import swal from 'sweetalert';

export default class RentAccomodation extends Component {
    constructor(){
        super();
        this.state = {
            status: 0,
        }
    }

    rentAccomodation = () => {
        let data = new FormData();
        data.append('status', this.state.status);
        data.append('accId', this.props.accId)
        fetch(apiUrl+'rentaccomodation',{
            method: 'post',
            headers:{
                'Authorization': JSON.parse(sessionStorage.getItem('userData')).token.api_token
            },
            body: data
        })
        .then(response => response.json())
        .then(res => {
            if(res.status === 'success'){
                swal({
                    text: 'Ce logement est loué',
                    icon: 'success',
                    button: {
                        closeModal: false,
                    }
                }).then(() => {
                    this.setState({status: 1});
                    this.props.onHide();
                    window.location.reload();
                });
            } else {
                swal(res.response[0]);
                console.log(res.response)
            }
        })
    }

    render() {
        return (
            <Modal
                show={this.props.showModal}
                onHide={this.props.onHide}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Louer un logement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                Nous vous recommandons de le louer que si un contrat de location a bien été signé. Cela vous éviterait d'annuler des visiter. 
                <hr />
                Êtes-vous sûr de le louer ?
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.rentAccomodation()}>
                        LOUER
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}