import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default class AddAnnounce extends Component {
    render() {
        return (
            <Modal
                show={this.props.showModal}
                onHide={this.props.handleClose}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton bg="success">
                    <Modal.Title>Annoncer un logement</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '450px', overflowY: 'auto' }}>
                    <Form>
                        <Form.Label>Nom du logement *</Form.Label>
                        <Form.Control placeholder="ex: Appartement 2 chambres" name="Title" type="text" required onChange={this.handleField} />
                        <br />
                        <Form.Control placeholder="Nombre de chambre*" min="1" name="nbRoom" type="number" required onChange={this.handleField} />
                        <br />
                        <Form.Control placeholder="Loyer €*" name="priceRent" min="0" type="number" required onChange={this.handleField} />
                        <br />
                        <Form.Control placeholder="Charges €*" name="priceCharges" min="0" type="number" required onChange={this.handleField} />
                        <br />
                        <Form.Label>Date de début *</Form.Label>
                        <Form.Control name="BeginingTime" type="date" required onChange={this.handleField} />
                        <br />
                        <Form.Label>Date de fin *</Form.Label>
                        <Form.Control name="EndTime" type="date" required onChange={this.handleField} />
                        <br />
                        <div>
                            <Form.Check
                                custom
                                inline
                                type="checkbox"
                                id="custom-checkbox1"
                                label="Y'a t-il du WiFi ?"
                            />
                            <Form.Check
                                custom
                                inline
                                type="checkbox"
                                id="custom-checkbox2"
                                label="Est-il meublé ?"
                            />
                            <Form.Check
                                custom
                                inline
                                type="checkbox"
                                id="custom-checkbox3"
                                label="Y'a t-il un parking ?"
                            />
                        </div>
                        <br />
                        <Form.Control placeholder="Description *" name="Description" type="text" as="textarea" required onChange={this.handleField} />
                        <br />
                        <Form.Label>Dans quelle ville ? *</Form.Label>
                        <Form.Control as="select" name="City" required onChange={this.handleField} />
                        <br />
                        <Form.Label>Dans quelle quartier ? *</Form.Label>
                        <Form.Control as="select" name="Neighborhood" required onChange={this.handleField} />
                        <br />
                        <Form.Label>De quel type de logement s'agit-il ? *</Form.Label>
                        <Form.Control as="select" name="Type" required onChange={this.handleField} />
                        <br />
                        <Form.Label>Ajoutez quelques Photos *</Form.Label>
                        <input className="form-control" type="image" name="Pictures" required onChange={this.handleField} />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" 
                    type="submit" 
                    onClick={this.props.handleClose}>
                        Publier une annonce
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}