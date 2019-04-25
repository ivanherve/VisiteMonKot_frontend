import React, { Component } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import moment from 'moment';
import { apiUrl } from '../../router';

export default class VisitAccomodation extends Component {
    constructor() {
        super();
        this.state = {
            dateVisit: '',
        }
    }
    visitAccomodation = (aid) => {
        let data = new FormData();
        data.append('aid', aid);
        data.append('date', this.state.dateVisit)
        fetch(apiUrl + 'visitaccomodation', {
            method: 'post',
            headers: {
                api_token: JSON.parse(sessionStorage.getItem('userData')).token.api_token
            },
            body: data
        })
            .then(response => response.json())
            .then(res => {
                if (res.status === 'error') {
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
        let today = moment(Date()).format('YYYY-MM-Do');
        return (
            <Modal show={this.props.show} onHide={this.props.hide}>
                <Modal.Header closeButton>Visiter {accomo.Title}</Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Label>
                            <strong>Choisir une date de visite</strong>
                            <br />
                            <i>A partir du: {moment(accomo.BeginingVisit).format('LL')}</i>
                        </Form.Label>
                        <Form.Control name="dateVisit" type="date" min={accomo.BeginingVisit < today ? today : accomo.BeginingVisit} required onChange={e => this.setState({ dateVisit: e.target.value })} />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-success' onClick={() => this.visitAccomodation(accomo.accomodation_id)}>Visiter</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}