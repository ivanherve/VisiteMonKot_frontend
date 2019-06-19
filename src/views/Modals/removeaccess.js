import React, {Component} from 'react';
import { Modal, Button } from 'react-bootstrap';

export default class RemoveAccess extends Component {
    render(){
        return(
            <Modal show={this.props.show} onHide={this.props.hide} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Retirer les accès de {this.props.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Etes-vous sûr de vouloir retirer les accès de <strong>{this.props.name}</strong> ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-danger'>RETIRER</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}