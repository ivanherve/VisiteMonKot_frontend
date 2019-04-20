import React, { Component } from 'react';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import moment from 'moment';
import { apiUrl } from '../../router';

export default class EditAccomodation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            hasWifi: 0,
            hasCarPark: 0,
            hasFurnitures: 0,
            description: '',
            priceCharges: 0,
            priceRent: 0,
            description: ''
        }
    }

    componentDidMount() {
        this.setState({ title: this.props.adv.Title });
        this.setState({ hasWifi: this.props.adv.hasWifi });
        this.setState({ hasFurnitures: this.props.adv.hasFurnitures });
        this.setState({ hasCarPark: this.props.adv.hasCarPark });
        this.setState({ description: this.props.adv.description });
        this.setState({ priceCharges: this.props.adv.priceCharges });
        this.setState({ priceRent: this.props.adv.priceRent });
        console.log(this.props.adv)
    }

    componentDidUpdate(nextProps) {
        if (this.props.adv.accomodation_id !== nextProps.adv.accomodation_id) {
            this.setState({ title: this.props.adv.Title });
            this.setState({ hasWifi: this.props.adv.hasWifi });
            this.setState({ hasFurnitures: this.props.adv.hasFurnitures });
            this.setState({ hasCarPark: this.props.adv.hasCarPark });
            this.setState({ description: this.props.adv.description });
            this.setState({ priceCharges: this.props.adv.priceCharges });
            this.setState({ priceRent: this.props.adv.priceRent });
            console.log([this.state, this.props.adv])
        }
    }

    updateAccomodation = () => {
        let data = new FormData();
        data.append('accId', this.props.adv.accomodation_id);
        data.append('title', this.state.title);
        data.append('rent', this.state.priceRent);
        data.append('charge', this.state.priceCharges);
        data.append('hasWifi', this.state.hasWifi);
        data.append('hasFurniture', this.state.hasFurnitures);
        data.append('hasParking', this.state.hasCarPark);
        data.append('description', this.state.description);
        fetch(apiUrl + 'updateaccomodation', {
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
                    alert('Logement mis à jour');
                    this.props.handleClose();
                    window.location.reload();
                }
            })
    }

    render() {
        let adv = this.state;
        return (
            <Modal
                show={this.props.showModal}
                onHide={this.props.handleClose}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>{adv.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row}>
                            <Form.Label column sm="2">
                                Titre
                                </Form.Label>
                            <Col sm="10">
                                <Form.Control type="text" placeholder={adv.title} onChange={e => this.setState({ title: e.target.value })} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="2">
                                Prix du Loyer
                                </Form.Label>
                            <Col sm="10">
                                <Form.Control type="number" min={0} placeholder={adv.priceRent + " €"} onChange={e => this.setState({ priceRent: e.target.value })} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="2">
                                Prix des Charges
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control type="number" min={0} placeholder={adv.priceCharges + " €"} onChange={e => this.setState({ priceCharges: e.target.value })} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="2">
                                Details
                            </Form.Label>
                            <Col sm="10">
                                <Form.Check
                                    custom
                                    inline
                                    checked={this.state.hasWifi === 1}
                                    type="checkbox"
                                    id="custom-checkbox1"
                                    label="Y'a t-il du WiFi ?"
                                    onChange={() => {/**/
                                        if (this.state.hasWifi === 0) {
                                            this.setState({ hasWifi: 1 });
                                        } else {
                                            this.setState({ hasWifi: 0 });
                                        }
                                    }}
                                />
                                <Form.Check
                                    custom
                                    inline
                                    checked={this.state.hasFurnitures === 1}
                                    type="checkbox"
                                    id="custom-checkbox2"
                                    label="Est-il meublé ?"
                                    onChange={e => {/**/
                                        if (this.state.hasFurnitures === 0) {
                                            this.setState({ hasFurnitures: 1 });
                                        } else {
                                            this.setState({ hasFurnitures: 0 });
                                        }
                                    }}
                                />
                                <Form.Check
                                    custom
                                    inline
                                    checked={this.state.hasCarPark === 1}
                                    type="checkbox"
                                    id="custom-checkbox3"
                                    label="Y'a t-il un parking ?"
                                    onChange={e => {/**/
                                        if (this.state.hasCarPark === 0) {
                                            this.setState({ hasCarPark: 1 });
                                        } else {
                                            this.setState({ hasCarPark: 0 });
                                        }
                                    }}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="2">
                                Description
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control placeholder={this.state.description} name="Description" type="text" as="textarea" required onChange={e => this.setState({ description: e.target.value })} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formPlaintextEmail">
                            <Form.Label column sm="2">
                                Mis à jour le
                                </Form.Label>
                            <Col sm="10">
                                <Form.Control plaintext defaultValue={moment().format('LLLL')} />
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => this.updateAccomodation()}>Modifier</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}