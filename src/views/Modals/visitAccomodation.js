import React, { Component } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { apiUrl } from '../../router';

export default class VisitAccomodation extends Component {
    constructor(){
        super();
        this.state = {
            dataVisit: '',
        }
    }
    visitAccomodation = (aid) => {
        let data = new FormData();
        data.append('aid', aid);
        data.append('date', this.state.dataVisit)
        fetch(apiUrl+'visitaccomodation',{
            method: 'post',
            headers: {
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
                alert(res.response);
                this.props.hide();
                window.location.reload();
            }
        })
    }
    render() {
    let accomo = this.props.accomo;
        return (
            <Modal show={this.props.show} onHide={this.props.hide}>
                <Modal.Header closeButton>Visiter {accomo.Title}</Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Label>Choisir une date de visite</Form.Label>
                        <Form.Control name="dataVisit" type="date" required onChange={e => this.setState({ dataVisit: e.target.value })} />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-success' onClick={() => this.visitAccomodation(accomo.accomodation_id)}>Visiter</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}