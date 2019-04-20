import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { apiUrl } from '../../router';

export default class FreeAccomodation extends Component {
    constructor(){
        super();
        this.state = {
            status: 1,
        }
    }

    freeAccomodation = () => {
        let data = new FormData();
        data.append('status', this.state.status);
        data.append('accId', this.props.accId)
        fetch(apiUrl+'freeaccomodation',{
            method: 'post',
            headers:{
                api_token: JSON.parse(sessionStorage.getItem('userData')).token.api_token
            },
            body: data
        })
        .then(response => response.json())
        .then(res => {
            if(res.status === 'error'){
                alert(res.response[0]);
                console.log(res.response)
            } else {
                alert('Ce logement est libéré');
                this.setState({status: 0});
                this.props.onHide();
                window.location.reload();
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
                    <Modal.Title>Libérer un logement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Êtes-vous sûr de le libérer ?
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.freeAccomodation()}>
                        LIBERER
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}